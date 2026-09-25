/**
 * Classifies a corpus unit this parser rejects against TypeScript's own
 * recorded behaviour.
 *
 * The oracle is TypeScript's recorded output rather than a reconstruction of
 * it. Each corpus test has a `.errors.txt` baseline iff tsc reported errors for
 * it, naming the file and position of each one, produced by TypeScript's test
 * runner with the options and lib each test asks for. Re-deriving that
 * in-process means rebuilding all of it and getting the lib graph right, and
 * getting it wrong hides gaps rather than reporting them.
 *
 * A rejection classifies as one of:
 *
 *   'agreed'     TypeScript rejects the unit too, so the rejection is correct.
 *   'no-record'  no baseline was recorded for the test at all.
 *   'never-read' TypeScript's module resolution never parsed the file.
 *   'suppressed' the test suppresses TypeScript's report of the error, with
 *                `// @ts-ignore` on the line above it or `@checkJs: false`.
 *   'gap'        TypeScript accepts the unit: a parser bug.
 *
 * The reference baselines are not part of the sparse checkout, being about
 * 250MB against 53MB for the cases, so `load_oracle` returns null until
 * `pnpm corpus:setup -- --baselines` has fetched them.
 */

import * as fs from 'fs';
import * as path from 'path';

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

/**
 * Loads the recorded baselines and returns `{ classify }`, or null when the
 * reference baselines have not been fetched.
 */
export function load_oracle(corpus_root) {
	const reference = path.join(corpus_root, 'tsc', 'testdata', 'baselines', 'reference');
	const cases_dir = path.join(corpus_root, 'tsc', 'testdata', 'tests', 'cases');

	if (!fs.existsSync(reference)) return null;

	// Cases under conformance/ are nested, but the baselines for both suites are
	// flat, and one case can have several baselines when it is run under many
	// option sets.
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
				// A .symbols or .types baseline has a section per file the compiler
				// actually read, which is how a file it never looked at can be told
				// apart from one it read and accepted.
				if (!processed.has(key)) processed.set(key, new Set());
				for (const section of fs.readFileSync(full, 'utf-8').matchAll(/^=== (.+?) ===$/gm)) {
					processed.get(key).add(section[1].replace(/^\//, ''));
				}
			}
		}
	}

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

	function classify(id, message) {
		const [case_path, unit] = id.split('::');
		const suite = case_path.split('/')[0];
		const key = `${suite}/` + path.basename(case_path).replace(/\.tsx?$/, '');
		const files = baselines.get(key) ?? [];

		if (!recorded.has(key)) return 'no-record';

		// TypeScript's module resolution tests park deliberately unparseable
		// payloads where resolution must not reach, so that reading one would show
		// up as an error. The compiler never parses those, and reporting them as
		// units it accepts would be wrong. Only trust this when a baseline recorded
		// which files were read.
		const read = processed.get(key);
		if (unit !== undefined && read !== undefined && read.size > 0) {
			const normalised = unit.replace(/^\//, '');
			if (![...read].some((file) => file === normalised)) return 'never-read';
		}

		// Direct blame is definitive: an error attributed to this unit means the
		// compiler both read and rejected it, whatever the heuristics below would
		// have guessed. A multi-file test may have errors in a sibling unit and
		// none in this one, so the blame has to be matched against the unit rather
		// than the test.
		const blamed = blamed_files(files);
		const blames_this_unit =
			unit === undefined
				? blamed.size > 0
				: [...blamed].some(
						(file) => file === unit || file.endsWith(`/${unit}`) || unit.endsWith(`/${file}`)
					);
		if (blames_this_unit) return 'agreed';

		const source = case_source(case_path);

		// A file redirected to a duplicate of its package gets a baseline section
		// under its own name, so the section check above cannot catch it.
		if (
			unit !== undefined &&
			source !== null &&
			is_redirected_duplicate(test_units(source), unit)
		) {
			return 'never-read';
		}

		if (source !== null) {
			// TypeScript did flag the spot, but the test suppresses the report:
			// either a `// @ts-ignore` sits on the line above it, or the rejected
			// unit is a JavaScript file the test runs with `@checkJs: false`, which
			// turns off the non-syntactic errors (redeclarations and the like)
			// TypeScript would otherwise report there.
			const position = /\((\d+):\d+\)\s*$/.exec(message);
			const lines = source.split(/\r?\n/);
			const ignored =
				position !== null && /@ts-ignore\b/.test(lines[Number(position[1]) - 2] ?? '');
			const unchecked =
				unit !== undefined &&
				/\.(m|c)?jsx?$/.test(unit) &&
				/^\s*\/\/\s*@checkjs\s*:\s*false\s*$/im.test(source);

			if (ignored || unchecked) return 'suppressed';
		}

		return 'gap';
	}

	return { classify };
}
