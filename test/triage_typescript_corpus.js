/**
 * Reports which corpus units we reject that TypeScript accepts.
 *
 * That is the one direction that matters here. This parser runs on source that has
 * already been through tsc -- in a bundler, for instance -- so being more lenient
 * than TypeScript is harmless while being stricter breaks a build that type-checked
 * cleanly. Every unit this prints is a bug.
 *
 * The oracle is TypeScript's own recorded output rather than a reconstruction of
 * it. Each corpus test has a `.errors.txt` baseline iff tsc reported errors for it,
 * naming the file and position of each one, produced by TypeScript's test runner
 * with the options and lib each test asks for. Re-deriving that in-process means
 * rebuilding all of it and getting the lib graph right, and getting it wrong hides
 * gaps rather than reporting them.
 *
 * Baselines are not part of the sparse checkout, being about 250MB against 53MB for
 * the cases, so this needs `pnpm corpus:setup --baselines` first.
 *
 * Usage: node test/triage_typescript_corpus.js [--list]
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo_root = path.join(__dirname, '..');
const corpus_root = process.env.TS_CORPUS ?? path.join(repo_root, 'corpus', 'typescript');
const reference = path.join(corpus_root, 'tsc', 'testdata', 'baselines', 'reference');
const baseline_path = path.join(__dirname, 'typescript_corpus_baseline.txt');

const list = process.argv.includes('--list');

if (!fs.existsSync(reference)) {
	console.error(`No baselines at ${reference}`);
	console.error('Run `pnpm corpus:setup --baselines` to fetch them (about 250MB).');
	process.exit(1);
}

// Cases under conformance/ are nested, but the baselines for both suites are flat,
// and one case can have several baselines when it is run under many option sets.
const baselines = new Map();
const processed = new Map();
const recorded = new Set();

for (const suite of ['compiler', 'conformance']) {
	for (const file of fs.readdirSync(path.join(reference, suite))) {
		// Any baseline at all means the compiler ran this test and its output was
		// recorded. A test with none has no recorded behaviour to compare against.
		const stem = /^(.*?)(\(.*\))?\.[^.]+(\.txt)?$/.exec(file);
		if (stem) recorded.add(`${suite}/${stem[1]}`);

		const match = /^(.*?)(\(.*\))?\.(errors\.txt|symbols|types)$/.exec(file);
		if (!match) continue;

		const key = `${suite}/${match[1]}`;
		const full = path.join(reference, suite, file);

		if (match[3] === 'errors.txt') {
			if (!baselines.has(key)) baselines.set(key, []);
			baselines.get(key).push(full);
		} else {
			// A .symbols or .types baseline has a section per file the compiler actually
			// read, which is how a file it never looked at can be told apart from one it
			// read and accepted.
			if (!processed.has(key)) processed.set(key, new Set());
			for (const section of fs.readFileSync(full, 'utf-8').matchAll(/^=== (.+?) ===$/gm)) {
				processed.get(key).add(section[1].replace(/^\//, ''));
			}
		}
	}
}

/** The files a test's baselines attribute at least one error to. */
function blamed_files(files) {
	const blamed = new Set();

	for (const file of files) {
		// A `@pretty: true` test records its errors with ANSI colour codes and as
		// `file:line:col - error TSxxxx` rather than `file(line,col): error TSxxxx`.
		const text = fs.readFileSync(file, 'utf-8').replace(/\u001b\[\d+m/g, '');

		for (const match of text.matchAll(/^(\S+)\((\d+),(\d+)\): error TS(\d+):/gm)) {
			blamed.add(match[1]);
		}
		for (const match of text.matchAll(/^(\S+):(\d+):(\d+) - error TS(\d+):/gm)) {
			blamed.add(match[1]);
		}
	}

	return blamed;
}

/**
 * The `// @filename:` units of a test, including the ones that are not code,
 * since a `package.json` unit is what decides module resolution.
 */
function test_units(source) {
	const units = new Map();
	let current = null;

	for (const line of source.split(/\r?\n/)) {
		const match = /^\s*\/\/\s*@filename\s*:\s*(.+?)\s*$/i.exec(line);
		if (match) {
			current = [];
			units.set(match[1].replace(/^\//, ''), current);
			continue;
		}
		if (current !== null) current.push(line);
	}

	return units;
}

/**
 * Whether TypeScript's module resolution may have redirected this unit to a
 * duplicate of the same package rather than parsing it. Two copies of a package
 * whose package.json name and version match are loaded once; the corpus parks
 * deliberately unparseable text in the copy that must not be read.
 */
function is_redirected_duplicate(units, unit) {
	const normalised = unit.replace(/^\//, '');
	if (!normalised.includes('node_modules/')) return false;

	const dir = normalised.replace(/\/[^/]+$/, '');
	const manifest = units.get(`${dir}/package.json`);
	if (!manifest) return false;

	let id;
	try {
		const parsed = JSON.parse(manifest.join('\n'));
		id = `${parsed.name}@${parsed.version}`;
	} catch {
		return false;
	}

	for (const [name, lines] of units) {
		if (name === `${dir}/package.json` || !name.endsWith('/package.json')) continue;
		try {
			const parsed = JSON.parse(lines.join('\n'));
			if (`${parsed.name}@${parsed.version}` === id) return true;
		} catch {
			// Not a manifest we can compare against.
		}
	}

	return false;
}

const cases_dir = path.join(corpus_root, 'tsc', 'testdata', 'tests', 'cases');
const source_cache = new Map();

function case_source(case_path) {
	if (!source_cache.has(case_path)) {
		let source = null;
		try {
			source = fs.readFileSync(path.join(cases_dir, case_path), 'utf-8');
		} catch {
			// Without the case source the suppression checks simply don't apply.
		}
		source_cache.set(case_path, source);
	}
	return source_cache.get(case_path);
}

const must_fix = [];
let tsc_agrees = 0;
let never_read = 0;
let no_record = 0;
let suppressed = 0;

const rejected = fs
	.readFileSync(baseline_path, 'utf-8')
	.split('\n')
	.filter((line) => line !== '' && !line.startsWith('#'));

for (const line of rejected) {
	const tab = line.indexOf('\t');
	const id = line.slice(0, tab);
	const message = line.slice(tab + 1);

	const [case_path, unit] = id.split('::');
	const suite = case_path.split('/')[0];
	const key = `${suite}/` + path.basename(case_path).replace(/\.tsx?$/, '');
	const files = baselines.get(key) ?? [];

	if (!recorded.has(key)) {
		no_record++;
		continue;
	}

	// TypeScript's module resolution tests park deliberately unparseable payloads
	// where resolution must not reach, so that reading one would show up as an error.
	// The compiler never parses those, and reporting them as units it accepts would
	// be wrong. Only trust this when a baseline recorded which files were read.
	const read = processed.get(key);
	if (unit !== undefined && read !== undefined && read.size > 0) {
		const normalised = unit.replace(/^\//, '');
		if (![...read].some((file) => file === normalised)) {
			never_read++;
			continue;
		}
	}

	const source = case_source(case_path);

	// A file redirected to a duplicate of its package gets a baseline section under
	// its own name, so the section check above cannot catch it.
	if (unit !== undefined && source !== null && is_redirected_duplicate(test_units(source), unit)) {
		never_read++;
		continue;
	}

	if (source !== null) {
		// TypeScript did flag the spot, but the test suppresses the report: either a
		// `// @ts-ignore` sits on the line above it, or the failing unit is a
		// JavaScript file the test runs with `@checkJs: false`, which turns off the
		// non-syntactic errors (redeclarations and the like) TypeScript would
		// otherwise report there.
		const position = /\((\d+):\d+\)\s*$/.exec(message);
		const lines = source.split(/\r?\n/);
		const ignored = position !== null && /@ts-ignore\b/.test(lines[Number(position[1]) - 2] ?? '');
		const unchecked =
			unit !== undefined &&
			/\.(m|c)?jsx?$/.test(unit) &&
			/^\s*\/\/\s*@checkjs\s*:\s*false\s*$/im.test(source);

		if (ignored || unchecked) {
			suppressed++;
			continue;
		}
	}

	if (files.length === 0) {
		must_fix.push({ id, message });
		continue;
	}

	const blamed = blamed_files(files);
	// A multi-file test may have errors in a sibling unit and none in this one, so
	// the blame has to be matched against the unit rather than the test.
	const blames_this_unit =
		unit === undefined
			? blamed.size > 0
			: [...blamed].some(
					(file) => file === unit || file.endsWith(`/${unit}`) || unit.endsWith(`/${file}`)
				);

	if (blames_this_unit) tsc_agrees++;
	else must_fix.push({ id, message });
}

const causes = new Map();
for (const { message } of must_fix) {
	const cause = message.replace(/\(\d+:\d+\)/, '').trim();
	causes.set(cause, (causes.get(cause) ?? 0) + 1);
}

console.log(`${rejected.length} units rejected by this parser:`);
console.log(`  TypeScript reports an error there too : ${tsc_agrees}`);
console.log(`  the test suppresses TypeScript's error: ${suppressed}`);
console.log(`  TypeScript never read that file       : ${never_read}`);
console.log(`  no recorded baseline for that test     : ${no_record}`);
console.log(`  TypeScript reports nothing            : ${must_fix.length}   <- must reach 0`);

if (must_fix.length > 0) {
	console.log('\nby cause:');
	for (const [cause, count] of [...causes].sort((a, b) => b[1] - a[1])) {
		console.log(`${String(count).padStart(5)}  ${cause}`);
	}
}

if (list) {
	console.log('\nunits:');
	for (const { id, message } of must_fix) console.log(`  ${id}\t${message}`);
}
