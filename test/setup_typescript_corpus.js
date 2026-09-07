import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const repo_root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const submodule_path = 'corpus/typescript';
const corpus_dir = path.join(repo_root, submodule_path);
const sparse_paths = ['tsc/testdata/tests/cases'];

function git(args, cwd = repo_root, stderr = 'inherit') {
	return execFileSync('git', args, { cwd, encoding: 'utf-8', stdio: ['ignore', 'pipe', stderr] });
}

const url = git(['config', '-f', '.gitmodules', `submodule.${submodule_path}.url`]).trim();

const entry = git(['ls-files', '-s', '--', submodule_path]).trim();
const pinned = entry.split(/\s+/)[1];

if (!/^[0-9a-f]{40}$/.test(pinned ?? '')) {
	console.error(`No submodule gitlink for ${submodule_path}; is the submodule registered?`);
	process.exit(1);
}

git(['config', 'submodule.recurse', 'false']);
git(['config', `submodule.${submodule_path}.fetchRecurseSubmodules`, 'false']);
git(['config', `submodule.${submodule_path}.update`, 'none']);

if (!fs.existsSync(path.join(corpus_dir, '.git'))) {
	console.log(`Initialising ${submodule_path}`);
	fs.mkdirSync(corpus_dir, { recursive: true });
	git(['init', '--quiet'], corpus_dir);
	git(['remote', 'add', 'origin', url], corpus_dir);
}

for (const [key, value] of [
	['fetch.recurseSubmodules', 'false'],
	['fetch.prune', 'false'],
	['gc.auto', '0'],
	['maintenance.auto', 'false'],
	['remote.origin.tagOpt', '--no-tags']
]) {
	git(['config', key, value], corpus_dir);
}

git(['sparse-checkout', 'init', '--cone'], corpus_dir);
git(['sparse-checkout', 'set', ...sparse_paths], corpus_dir);

const head = (() => {
	try {
		return git(['rev-parse', 'HEAD'], corpus_dir, 'ignore').trim();
	} catch {
		return null;
	}
})();

if (head === pinned) {
	console.log(`${submodule_path} already at ${pinned.slice(0, 12)}`);
} else {
	console.log(`Fetching ${pinned.slice(0, 12)} from ${url}`);
	git(['fetch', '--depth', '1', 'origin', pinned], corpus_dir);
	git(['checkout', '--quiet', '--detach', pinned], corpus_dir);
	console.log(`${submodule_path} at ${pinned.slice(0, 12)}`);
}

const cases = path.join(corpus_dir, 'tsc', 'testdata', 'tests', 'cases');

if (!fs.existsSync(cases)) {
	console.error(`Expected test cases at ${cases}, but the path is missing.`);
	console.error('The corpus layout may have moved upstream.');
	process.exit(1);
}
