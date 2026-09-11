/**
 * Runs the parser over the TypeScript compiler's own test corpus
 * (`tsc/testdata/tests/cases/{compiler,conformance}` in microsoft/TypeScript).
 *
 * The corpus is not a pass/fail suite: a large share of its files hold
 * deliberate syntax errors, because they exist to pin down the compiler's error
 * messages. Rather than asserting that everything parses, we record which
 * units fail and diff that against a committed baseline. A new failure fails
 * CI; a fixed one shows up as a removed baseline line.
 *
 * Usage:
 *   node test/run_typescript_corpus.js              diff against the baseline
 *   node test/run_typescript_corpus.js --update     rewrite the baseline
 *   node test/run_typescript_corpus.js --filter foo only units whose id matches
 *   node test/run_typescript_corpus.js --list-new   print every new failure
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as acorn from 'acorn';
// @ts-ignore - only used by --tsc, and typescript is a dev dependency
import ts from 'typescript';
import { tsPlugin } from '../index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo_root = path.join(__dirname, '..');

const corpus_root = process.env.TS_CORPUS ?? path.join(repo_root, 'corpus', 'typescript');
const cases_dir = path.join(corpus_root, 'tsc', 'testdata', 'tests', 'cases');
const baseline_path = path.join(__dirname, 'typescript_corpus_baseline.txt');

const SUITES = ['compiler', 'conformance'];

const PARSEABLE = /\.(m|c)?(ts|tsx|js|jsx)$/;

const DIRECTIVE = /^\s*\/\/\s*@\w+\s*:/;

const args = process.argv.slice(2);
const update = args.includes('--update');
const list_new = args.includes('--list-new');
const compare_tsc = args.includes('--tsc');
const filter = (() => {
	const i = args.indexOf('--filter');
	return i === -1 ? null : args[i + 1];
})();

const TsParser = acorn.Parser.extend(tsPlugin());
const DtsParser = acorn.Parser.extend(tsPlugin({ dts: true }));
const JsxParser = acorn.Parser.extend(tsPlugin({ jsx: true }));

function parser_for(filename) {
	// A declaration file is not only `.d.ts`: TypeScript also treats `.d.<anything>.ts`
	// as one, which is how a non-JavaScript asset gets typed, as in `component.d.html.ts`.
	if (/\.d(\.[^.]+)*\.(m|c)?ts$/.test(filename)) return DtsParser;
	// TypeScript reads '<' as JSX in .tsx and in every .js flavour, and as a type
	// assertion only in .ts, so a plain .js unit needs the JSX parser too.
	if (/\.(m|c)?jsx?$/.test(filename) || /\.tsx$/.test(filename)) return JsxParser;
	return TsParser;
}

/**
 * Some corpus files are UTF-16, so decoding everything as UTF-8 would turn them
 * into replacement characters and report failures that are ours, not the
 * parser's. A leading UTF-8 BOM is dropped for the same reason: it would push a
 * `#!` prologue off offset 0.
 */
function read_source(file) {
	const buffer = fs.readFileSync(file);

	if (buffer[0] === 0xff && buffer[1] === 0xfe) return buffer.toString('utf16le', 2);
	if (buffer[0] === 0xfe && buffer[1] === 0xff) return buffer.swap16().toString('utf16le', 2);

	return buffer.toString('utf8').replace(/^﻿/, '');
}

/**
 * Splits a corpus test into its virtual files. Tests describe multi-file
 * programs with `// @filename: a.ts` headers, and everything before the first
 * one belongs to the test file itself.
 *
 * The `// @option: value` prologue is stripped rather than left in place,
 * matching what the TypeScript harness does: keeping it would leave a `#!` line
 * partway down the file, where it is not valid. `line_offset` records how many
 * lines went away so reported positions still point into the real file.
 */
function split_units(rel_path, source) {
	const units = [];
	let current = null;

	source.split(/\r?\n/).forEach((line, index) => {
		const match = /^\s*\/\/\s*@filename\s*:\s*(.+?)\s*$/i.exec(line);

		if (match) {
			current = { name: match[1], first_line: index + 2, lines: [] };
			units.push(current);
			return;
		}

		if (current === null) {
			current = { name: path.basename(rel_path), first_line: index + 1, lines: [] };
			units.push(current);
		}

		current.lines.push(line);
	});

	return units
		.filter((unit) => PARSEABLE.test(unit.name))
		.map((unit) => {
			// Drop the leading option prologue so that a shebang, if present, is
			// the first thing the parser sees.
			let start = 0;
			while (
				start < unit.lines.length &&
				(unit.lines[start].trim() === '' || DIRECTIVE.test(unit.lines[start]))
			) {
				start++;
			}

			return {
				name: unit.name,
				code: unit.lines.slice(start).join('\n'),
				line_offset: unit.first_line + start - 1,
				multi: units.length > 1
			};
		})
		.filter((unit) => unit.code.trim() !== '')
		.map((unit) => ({
			...unit,
			id: unit.multi ? `${rel_path}::${unit.name}` : rel_path
		}));
}

/**
 * The corpus does not label script vs module, and TypeScript accepts both
 * grammars per file. Trying module first and falling back to script mirrors
 * that, so `with` blocks and friends are not counted as parse failures.
 */
function parse_unit(unit) {
	const Parser = parser_for(unit.name);
	let module_error;

	// TypeScript accepts an undeclared private name in a JavaScript file even with
	// checkJs on -- `x.#bar.baz = 20` is how an expando private is written -- so
	// acorn's must-be-declared-in-a-class check only applies to TypeScript units.
	const checkPrivateFields = !/\.(m|c)?jsx?$/.test(unit.name);

	for (const sourceType of ['module', 'script']) {
		try {
			Parser.parse(unit.code, {
				sourceType,
				ecmaVersion: 'latest',
				allowHashBang: true,
				checkPrivateFields,
				locations: true
			});
			return null;
		} catch (e) {
			if (sourceType === 'module') module_error = e;
			if (!(e instanceof SyntaxError)) return `${e.constructor.name}: ${e.message}`;
		}
	}

	// Rewrite the position so it refers to the original test file rather than to
	// the prologue-stripped slice we handed the parser.
	return module_error.message.replace(/\((\d+):(\d+)\)/, (_, line, column) => {
		return `(${Number(line) + unit.line_offset}:${column})`;
	});
}

function tsc_rejects(unit) {
	const kind = /\.tsx$/.test(unit.name)
		? ts.ScriptKind.TSX
		: /\.jsx$/.test(unit.name)
			? ts.ScriptKind.JSX
			: /\.(m|c)?js$/.test(unit.name)
				? ts.ScriptKind.JS
				: ts.ScriptKind.TS;

	let source;
	try {
		source = ts.createSourceFile(unit.name, unit.code, ts.ScriptTarget.Latest, false, kind);
	} catch (e) {
		// The corpus tracks TypeScript's own main branch, which can be well ahead of the
		// typescript dev dependency; a version behind it may assert rather than parse.
		tsc_crashes.push(`${unit.id}\t${e.message}`);
		return null;
	}

	const diagnostics = source.parseDiagnostics ?? [];

	return diagnostics.length === 0
		? null
		: `TS${diagnostics[0].code}: ${ts.flattenDiagnosticMessageText(diagnostics[0].messageText, ' ')}`;
}

function walk(dir, rel) {
	const out = [];

	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const child_rel = `${rel}/${entry.name}`;

		if (entry.isDirectory()) {
			out.push(...walk(path.join(dir, entry.name), child_rel));
		} else if (PARSEABLE.test(entry.name)) {
			out.push(child_rel);
		}
	}

	return out;
}

if (!fs.existsSync(cases_dir)) {
	console.error(`TypeScript corpus not found at ${cases_dir}`);
	console.error('Run `pnpm corpus:setup` to fetch it.');
	process.exit(1);
}

const failures = new Map();
const tsc_crashes = [];
const we_reject = new Map();
const we_accept = new Map();
let both_ok = 0;
let both_reject = 0;
let total_units = 0;
let total_files = 0;

for (const suite of SUITES) {
	const suite_dir = path.join(cases_dir, suite);
	if (!fs.existsSync(suite_dir)) continue;

	for (const rel of walk(suite_dir, suite).sort()) {
		if (filter && !rel.includes(filter)) continue;

		total_files++;

		for (const unit of split_units(rel, read_source(path.join(cases_dir, rel)))) {
			total_units++;
			const error = parse_unit(unit);
			// Baseline lines are tab separated, so a message must stay on one line.
			if (error !== null) failures.set(unit.id, error.replace(/\s+/g, ' ').trim());

			if (compare_tsc) {
				const tsc = tsc_rejects(unit);
				if (tsc === null && error !== null) {
					we_reject.set(unit.id, error.replace(/\s+/g, ' ').trim());
				} else if (tsc !== null && error === null) {
					we_accept.set(unit.id, tsc.replace(/\s+/g, ' ').trim());
				} else if (tsc === null) {
					both_ok++;
				} else {
					both_reject++;
				}
			}
		}
	}
}

const sorted = [...failures.keys()].sort();
const rate = total_units === 0 ? 0 : (failures.size / total_units) * 100;

if (compare_tsc) {
	const agree = both_ok + both_reject;
	const pct = (n) => ((n / total_units) * 100).toFixed(2);

	console.log(`${total_units} units in ${total_files} files, against TypeScript's own parser:`);
	console.log(`  both accept        ${both_ok} (${pct(both_ok)}%)`);
	console.log(`  both reject        ${both_reject} (${pct(both_reject)}%)`);
	console.log(`  we reject, tsc ok  ${we_reject.size} (${pct(we_reject.size)}%)   <- gaps`);
	console.log(`  we accept, tsc no  ${we_accept.size} (${pct(we_accept.size)}%)   <- leniency`);
	console.log(`  agreement          ${pct(agree)}%`);
	if (tsc_crashes.length > 0) {
		console.log(`  tsc threw on       ${tsc_crashes.length} (counted as tsc accepting)`);
	}

	const show = list_new ? Infinity : 20;
	for (const [label, set] of [
		['we reject, tsc accepts', we_reject],
		['we accept, tsc rejects', we_accept]
	]) {
		if (set.size === 0) continue;
		console.log(`\n${label}:`);
		let n = 0;
		for (const [id, message] of [...set].sort()) {
			if (n++ >= show) {
				console.log(`  ... and ${set.size - show} more (pass --list-new for all)`);
				break;
			}
			console.log(`  ${id}\t${message}`);
		}
	}

	process.exit(0);
}

if (update) {
	fs.writeFileSync(
		baseline_path,
		[
			'# Parse failures over the TypeScript compiler test corpus.',
			'# Regenerate with `pnpm test:typescript:update`.',
			'#',
			'# Many entries here are correct: the corpus deliberately includes invalid',
			'# syntax to pin down compiler error messages. This file exists to catch',
			'# *changes*, not to assert that everything listed ought to parse.',
			`# units: ${total_units}  failing: ${failures.size} (${rate.toFixed(2)}%)`,
			'',
			...sorted.map((id) => `${id}\t${failures.get(id)}`),
			''
		].join('\n')
	);

	console.log(
		`Wrote ${path.relative(repo_root, baseline_path)}: ` +
			`${failures.size} failing of ${total_units} units in ${total_files} files.`
	);
	process.exit(0);
}

if (!fs.existsSync(baseline_path)) {
	console.error(`No baseline at ${path.relative(repo_root, baseline_path)}.`);
	console.error('Run `pnpm test:typescript:update` to create it.');
	process.exit(1);
}

const baseline = new Map(
	fs
		.readFileSync(baseline_path, 'utf-8')
		.split('\n')
		.filter((line) => line !== '' && !line.startsWith('#'))
		.map((line) => {
			const tab = line.indexOf('\t');
			return [line.slice(0, tab), line.slice(tab + 1)];
		})
);

const added = sorted.filter((id) => !baseline.has(id));
const removed = [...baseline.keys()].filter((id) => !failures.has(id));
const changed = sorted.filter((id) => baseline.has(id) && baseline.get(id) !== failures.get(id));

console.log(
	`${total_units} units in ${total_files} files; ${failures.size} failing (${rate.toFixed(2)}%).`
);

if (filter) {
	console.log(`(--filter ${filter}: only matched units were run)`);
}

for (const id of removed) console.log(`  fixed:   ${id}`);

for (const id of changed) {
	console.log(`  changed: ${id}`);
	console.log(`    was: ${baseline.get(id)}`);
	console.log(`    now: ${failures.get(id)}`);
}

const shown = list_new ? added : added.slice(0, 25);
for (const id of shown) console.log(`  NEW:     ${id}\t${failures.get(id)}`);
if (added.length > shown.length) {
	console.log(`  ... and ${added.length - shown.length} more (pass --list-new for all)`);
}

if (added.length > 0 || changed.length > 0) {
	console.error(
		`\n${added.length} new and ${changed.length} changed parse failures. ` +
			'If these are expected, run `pnpm test:typescript:update`.'
	);
	process.exit(1);
}

// A filtered run only sees part of the corpus, so absent entries are not fixes.
if (removed.length > 0 && !filter) {
	console.error(
		`\n${removed.length} baseline entries now parse. ` +
			'Run `pnpm test:typescript:update` to record the improvement.'
	);
	process.exit(1);
}

console.log('No change against baseline.');
