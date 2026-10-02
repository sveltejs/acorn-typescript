/**
 * Runs the parser over the TypeScript compiler's own test corpus
 * (`tsc/testdata/tests/cases/{compiler,conformance}` in microsoft/TypeScript).
 *
 * The corpus is not a pass/fail suite: a large share of its files hold
 * deliberate syntax errors, because they exist to pin down the compiler's error
 * messages. Rather than asserting that everything parses, we record which
 * units this parser rejects and diff that against a committed baseline. A new
 * rejection fails CI; a fixed one shows up as a removed baseline line.
 *
 * The baseline is classified against TypeScript's own recorded output (see
 * typescript_corpus_oracle.js): rejections TypeScript agrees with are correct
 * behaviour, and only the "gaps" section holds parser bugs. Rewriting the
 * baseline therefore needs the reference baselines fetched by
 * `pnpm corpus:setup -- --baselines`.
 *
 * Usage:
 *   node test/run_typescript_corpus.js              diff against the baseline
 *   node test/run_typescript_corpus.js --update     rewrite the baseline
 *   node test/run_typescript_corpus.js --filter foo only units whose id matches
 *   node test/run_typescript_corpus.js --list-new   print every new rejection
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as acorn from 'acorn';
import { tsPlugin } from '../index.js';
import { load_oracle, split_files } from './typescript_corpus_oracle.js';

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
 * Splits a corpus test into the units this parser can read.
 *
 * The `// @option: value` prologue is stripped rather than left in place,
 * matching what the TypeScript harness does: keeping it would leave a `#!` line
 * partway down the file, where it is not valid. `line_offset` records how many
 * lines went away so reported positions still point into the real file.
 */
function split_units(rel_path, source) {
	const units = split_files(source, path.basename(rel_path));

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

function walk(dir, rel) {
	return fs
		.readdirSync(dir, { recursive: true })
		.filter((child) => PARSEABLE.test(child))
		.map((child) => `${rel}/${child.split(path.sep).join('/')}`);
}

if (!fs.existsSync(cases_dir)) {
	console.error(`TypeScript corpus not found at ${cases_dir}`);
	console.error('Run `pnpm corpus:setup` to fetch it.');
	process.exit(1);
}

const failures = new Map();
const failed_sources = new Map();
let total_units = 0;
let total_files = 0;

for (const suite of SUITES) {
	const suite_dir = path.join(cases_dir, suite);
	if (!fs.existsSync(suite_dir)) continue;

	for (const rel of walk(suite_dir, suite).sort()) {
		if (filter && !rel.includes(filter)) continue;

		total_files++;

		const source = read_source(path.join(cases_dir, rel));

		for (const unit of split_units(rel, source)) {
			total_units++;
			const error = parse_unit(unit);
			if (error === null) continue;
			// Baseline lines are tab separated, so a message must stay on one line.
			failures.set(unit.id, error.replace(/\s+/g, ' ').trim());
			failed_sources.set(unit.id, source);
		}
	}
}

const sorted = [...failures.keys()].sort();
const rate = total_units === 0 ? 0 : (failures.size / total_units) * 100;

if (update) {
	const oracle = load_oracle(corpus_root);
	if (oracle === null) {
		console.error('Updating the baseline classifies each rejection against the recorded');
		console.error('TypeScript baselines, which have not been fetched.');
		console.error('Run `pnpm corpus:setup -- --baselines` first (about 250MB).');
		process.exit(1);
	}

	const kinds = new Map(
		sorted.map((id) => [id, oracle.classify(id, failures.get(id), failed_sources.get(id))])
	);
	const of_kind = (...wanted) => sorted.filter((id) => wanted.includes(kinds.get(id)));
	const lines = (ids) => ids.map((id) => `${id}\t${failures.get(id)}`);

	const agreed = of_kind('agreed');
	const gaps = of_kind('gap');
	const suppressed = of_kind('suppressed');
	const never_read = of_kind('never-read');
	const no_record = of_kind('no-record');

	fs.writeFileSync(
		baseline_path,
		[
			'# Units of the TypeScript compiler test corpus that this parser rejects,',
			'# classified against the recorded output of TypeScript itself.',
			'# Regenerate with `pnpm test:typescript:update`.',
			'#',
			'# Nearly everything here is correct behaviour: the corpus deliberately',
			'# includes invalid syntax to pin down compiler error messages. This file',
			'# exists to catch *changes*, not to assert that anything ought to parse.',
			`# units: ${total_units}  rejected: ${failures.size} (${rate.toFixed(2)}%)`,
			'',
			`## agreed (${agreed.length}): TypeScript rejects these units too`,
			'',
			...lines(agreed),
			'',
			`## not comparable (${suppressed.length + never_read.length + no_record.length}): TypeScript's recorded output says nothing about the unit`,
			'',
			`### the test suppresses TypeScript's error (@ts-ignore, @checkJs: false) (${suppressed.length})`,
			...lines(suppressed),
			`### TypeScript's module resolution never read the file (${never_read.length})`,
			...lines(never_read),
			`### no baseline was recorded for the test (${no_record.length})`,
			...lines(no_record),
			'',
			`## gaps (${gaps.length}): TypeScript accepts these units, so each entry is a parser bug`,
			'',
			...lines(gaps),
			''
		].join('\n')
	);

	console.log(
		`Wrote ${path.relative(repo_root, baseline_path)}: ` +
			`${failures.size} rejected of ${total_units} units in ${total_files} files ` +
			`(agreed: ${agreed.length}, not comparable: ${
				suppressed.length + never_read.length + no_record.length
			}, gaps: ${gaps.length}).`
	);

	if (gaps.length > 0) {
		console.error('\nGaps are units TypeScript accepts but this parser rejects — parser bugs:');
		for (const id of gaps) console.error(`  ${id}\t${failures.get(id)}`);
	}

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
	`${total_units} units in ${total_files} files; ${failures.size} rejected (${rate.toFixed(2)}%).`
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
		`\n${added.length} new and ${changed.length} changed rejections. ` +
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
