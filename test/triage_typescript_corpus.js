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

for (const suite of ['compiler', 'conformance']) {
	for (const file of fs.readdirSync(path.join(reference, suite))) {
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
		for (const match of fs
			.readFileSync(file, 'utf-8')
			.matchAll(/^(\S+)\((\d+),(\d+)\): error TS(\d+):/gm)) {
			blamed.add(match[1]);
		}
	}

	return blamed;
}

const must_fix = [];
let tsc_agrees = 0;
let never_read = 0;

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
console.log(`  TypeScript never read that file       : ${never_read}`);
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
