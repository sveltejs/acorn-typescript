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

/**
 * The files a test's baselines attribute at least one error to, each mapped to
 * the error codes attributed to it.
 */
function blamed_files(files) {
	const blamed = new Map();
	const blame = (file, code) => {
		if (!blamed.has(file)) blamed.set(file, new Set());
		blamed.get(file).add(Number(code));
	};

	for (const file of files) {
		// A `@pretty: true` test records its errors with ANSI colour codes and as
		// `file:line:col - error TSxxxx` rather than `file(line,col): error TSxxxx`.
		const text = fs.readFileSync(file, 'utf-8').replace(/\u001b\[\d+m/g, '');

		for (const match of text.matchAll(/^(\S+)\((\d+),(\d+)\): error TS(\d+):/gm)) {
			blame(match[1], match[4]);
		}
		for (const match of text.matchAll(/^(\S+):(\d+):(\d+) - error TS(\d+):/gm)) {
			blame(match[1], match[4]);
		}
	}

	return blamed;
}

/** Whether a blamed file name from a baseline refers to the given unit. */
function names_unit(file, unit) {
	return file === unit || file.endsWith(`/${unit}`) || unit.endsWith(`/${file}`);
}

/**
 * Splits a corpus test into its virtual files, including the ones that are not
 * code. Tests describe multi-file programs with `// @filename: a.ts` headers,
 * and everything before the first one belongs to `first_name`.
 */
export function split_files(source, first_name) {
	const files = [];
	let current = null;

	source.split(/\r?\n/).forEach((line, index) => {
		const match = /^\s*\/\/\s*@filename\s*:\s*(.+?)\s*$/i.exec(line);

		if (match) {
			current = { name: match[1], first_line: index + 2, lines: [] };
			files.push(current);
			return;
		}

		if (current === null) {
			current = { name: first_name, first_line: index + 1, lines: [] };
			files.push(current);
		}

		current.lines.push(line);
	});

	return files;
}

/**
 * Whether TypeScript's module resolution may have redirected this unit to a
 * duplicate of the same package rather than parsing it. Two copies of a package
 * whose package.json name and version match are loaded once; the corpus parks
 * deliberately unparseable text in the copy that must not be read.
 */
function is_redirected_duplicate(files, unit) {
	const normalised = unit.replace(/^\//, '');
	if (!normalised.includes('node_modules/')) return false;

	const own = `${normalised.replace(/\/[^/]+$/, '')}/package.json`;
	const packages = new Map();

	for (const file of files) {
		const name = file.name.replace(/^\//, '');
		if (!name.endsWith('/package.json')) continue;
		try {
			const parsed = JSON.parse(file.lines.join('\n'));
			packages.set(name, `${parsed.name}@${parsed.version}`);
		} catch {
			// Not a manifest we can compare against.
		}
	}

	const id = packages.get(own);
	return id !== undefined && [...packages].some(([name, other]) => name !== own && other === id);
}

/**
 * Loads the recorded baselines and returns `{ classify }`, or null when the
 * reference baselines have not been fetched.
 */
export function load_oracle(corpus_root) {
	const reference = path.join(corpus_root, 'tsc', 'testdata', 'baselines', 'reference');

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

			const match = /^(.*?)(\(.*\))?\.(errors\.txt|types)$/.exec(file);
			if (!match) continue;

			const key = `${suite}/${match[1]}`;
			const full = path.join(reference, suite, file);

			if (match[3] === 'errors.txt') {
				if (!baselines.has(key)) baselines.set(key, []);
				baselines.get(key).push(full);
			} else {
				// A .types baseline has a section per file the compiler
				// actually read, which is how a file it never looked at can be told
				// apart from one it read and accepted.
				if (!processed.has(key)) processed.set(key, new Set());
				for (const section of fs.readFileSync(full, 'utf-8').matchAll(/^=== (.+?) ===$/gm)) {
					processed.get(key).add(section[1].replace(/^\//, ''));
				}
			}
		}
	}

	function key_of(case_path) {
		const suite = case_path.split('/')[0];
		return `${suite}/` + path.basename(case_path).replace(/\.[tj]sx?$/, '');
	}

	function classify(id, message, source) {
		const [case_path, unit] = id.split('::');
		const key = key_of(case_path);
		const files = baselines.get(key) ?? [];

		if (!recorded.has(key)) return 'no-record';

		// TypeScript's module resolution tests park deliberately unparseable
		// payloads where resolution must not reach, so that reading one would show
		// up as an error. The compiler never parses those, and reporting them as
		// units it accepts would be wrong. Only trust this when a baseline recorded
		// which files were read.
		const read = processed.get(key);
		if (unit !== undefined && read !== undefined && read.size > 0) {
			if (!read.has(unit.replace(/^\//, ''))) return 'never-read';
		}

		// Direct blame is definitive: an error attributed to this unit means the
		// compiler both read and rejected it, whatever the heuristics below would
		// have guessed. A multi-file test may have errors in a sibling unit and
		// none in this one, so the blame has to be matched against the unit rather
		// than the test.
		const blamed = blamed_files(files);
		const blames_this_unit =
			unit === undefined ? blamed.size > 0 : [...blamed.keys()].some((file) => names_unit(file, unit));
		if (blames_this_unit) return 'agreed';

		// A file redirected to a duplicate of its package gets a baseline section
		// under its own name, so the section check above cannot catch it.
		if (unit !== undefined && is_redirected_duplicate(split_files(source, case_path), unit)) {
			return 'never-read';
		}

		// TypeScript did flag the spot, but the test suppresses the report:
		// either a `// @ts-ignore` sits on the line above it, or the rejected
		// unit is a JavaScript file the test runs with `@checkJs: false`, which
		// turns off the non-syntactic errors (redeclarations and the like)
		// TypeScript would otherwise report there.
		const position = /\((\d+):\d+\)\s*$/.exec(message);
		const lines = source.split(/\r?\n/);
		const ignored = position !== null && /@ts-ignore\b/.test(lines[Number(position[1]) - 2] ?? '');
		const unchecked =
			unit !== undefined &&
			/\.(m|c)?jsx?$/.test(unit) &&
			/^\s*\/\/\s*@checkjs\s*:\s*false\s*$/im.test(source);

		return ignored || unchecked ? 'suppressed' : 'gap';
	}

	function syntax_errors(id) {
		const [case_path, unit] = id.split('::');
		const blamed = blamed_files(baselines.get(key_of(case_path)) ?? []);
		const codes = new Set();

		for (const [file, file_codes] of blamed) {
			if (unit !== undefined && !names_unit(file, unit)) continue;
			for (const code of file_codes) {
				if (code >= 1000 && code < 2000) codes.add(code);
			}
		}

		return [...codes].sort((a, b) => a - b);
	}

	return { classify, syntax_errors };
}
