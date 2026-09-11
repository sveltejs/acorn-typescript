/**
 * Re-classifies the committed baseline of rejected corpus units against
 * TypeScript's recorded output, and reports the gaps: units TypeScript accepts
 * that this parser rejects.
 *
 * That is the one direction that matters here. This parser runs on source that
 * has already been through tsc -- in a bundler, for instance -- so being more
 * lenient than TypeScript is harmless while being stricter breaks a build that
 * type-checked cleanly. Every gap this prints is a bug.
 *
 * `pnpm test:typescript:update` writes the same classification into the
 * baseline's sections; this script recomputes it from scratch, which is what
 * catches a stale classification after the corpus submodule moves.
 *
 * The classification itself lives in typescript_corpus_oracle.js and needs
 * `pnpm corpus:setup --baselines` first (about 250MB).
 *
 * Usage: node test/triage_typescript_corpus.js [--list]
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { load_oracle } from './typescript_corpus_oracle.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo_root = path.join(__dirname, '..');
const corpus_root = process.env.TS_CORPUS ?? path.join(repo_root, 'corpus', 'typescript');
const baseline_path = path.join(__dirname, 'typescript_corpus_baseline.txt');

const list = process.argv.includes('--list');

const oracle = load_oracle(corpus_root);
if (oracle === null) {
	console.error(`No recorded TypeScript baselines under ${corpus_root}.`);
	console.error('Run `pnpm corpus:setup --baselines` to fetch them (about 250MB).');
	process.exit(1);
}

const rejected = fs
	.readFileSync(baseline_path, 'utf-8')
	.split('\n')
	.filter((line) => line !== '' && !line.startsWith('#'));

const gaps = [];
const counts = { agreed: 0, suppressed: 0, 'never-read': 0, 'no-record': 0 };

for (const line of rejected) {
	const tab = line.indexOf('\t');
	const id = line.slice(0, tab);
	const message = line.slice(tab + 1);

	const kind = oracle.classify(id, message);
	if (kind === 'gap') gaps.push({ id, message });
	else counts[kind]++;
}

const causes = new Map();
for (const { message } of gaps) {
	const cause = message.replace(/\(\d+:\d+\)/, '').trim();
	causes.set(cause, (causes.get(cause) ?? 0) + 1);
}

console.log(`${rejected.length} units rejected by this parser:`);
console.log(`  TypeScript rejects them too            : ${counts.agreed}`);
console.log(`  the test suppresses TypeScript's error : ${counts.suppressed}`);
console.log(`  TypeScript never read that file        : ${counts['never-read']}`);
console.log(`  no recorded baseline for that test     : ${counts['no-record']}`);
console.log(`  gaps: TypeScript accepts these         : ${gaps.length}   <- must reach 0`);

if (gaps.length > 0) {
	console.log('\nby cause:');
	for (const [cause, count] of [...causes].sort((a, b) => b[1] - a[1])) {
		console.log(`${String(count).padStart(5)}  ${cause}`);
	}
}

if (list) {
	console.log('\nunits:');
	for (const { id, message } of gaps) console.log(`  ${id}\t${message}`);
}

process.exit(gaps.length > 0 ? 1 : 0);
