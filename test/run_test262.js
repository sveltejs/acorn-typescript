import * as path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore - no types
import run from 'test262-parser-runner';
import * as acorn from 'acorn';
// import { tsPlugin } from '../dist/acorn-typescript.esm.js';
import { tsPlugin } from '../index.js';

const parser = acorn.Parser.extend(tsPlugin());
const UNSUPPORTED_FEATURES = [
	// TODO regularly check those; they might become stage 4 at some point and then Acorn core should support them
	
	'import-defer',
	'source-phase-imports',
	'source-phase-imports-module-source'
];

const SKIP_FILES = [
	// `1 < 2 > 3;` cannot be parsed well.
	// This is because `< 2 >` is judged as TypeArguments.
	// See https://github.com/TyrealHu/acorn-typescript/issues/21
	'test/language/punctuators/S7.7_A1.js',
	// Both V8 and Acorn reject a `using` declaration directly in a bare case clause,
	// allowing it only inside a block, and these staging tests assume otherwise.
	'test/staging/explicit-resource-management/await-using-in-switch-case-block.js',
	'test/staging/explicit-resource-management/call-dispose-methods.js'
];

// Some keywords still don't throw an error.
// See https://github.com/TyrealHu/acorn-typescript/issues/23
const WHITELIST = [
	// `this` variable name. e.g. `var this = 42`
	'language/identifiers/val-this.js',
	'language/identifiers/val-this-via-escape-hex.js',
	'language/identifiers/val-this-via-escape-hex4.js',
	'language/module-code/early-dup-export-as-star-as.js',
	'language/module-code/early-dup-export-dflt-id.js',
	'language/module-code/early-dup-export-id-as.js',
	'language/module-code/early-dup-export-id.js',
	'language/module-code/early-dup-export-star-as-dflt.js',
	// various stuff
	'staging/sm/module/duplicate-exported-names-in-single-export-declaration.js',
	'staging/sm/module/duplicate-exported-names-in-single-export-var-declaration.js',
	'staging/sm/module/module-export-name-star.js',
	'staging/sm/String/make-normalize-generateddata-input.py' // python??
].flatMap((s) => [s + ' (default)', s + ' (strict mode)']);

run(
	(content, { sourceType }) => {
		return parser.parse(content, {
			sourceType,
			ecmaVersion: 'latest',
			locations: true
		});
	},
	{
		testsDirectory: path.dirname(fileURLToPath(import.meta.resolve('test262/package.json'))),
		skip: (test) => {
			return (
				(test.attrs.features &&
					UNSUPPORTED_FEATURES.some((f) => test.attrs.features.includes(f))) ||
				SKIP_FILES.includes(test.file)
			);
		},
		whitelist: WHITELIST.map((filename) =>
			path.sep === '/' ? filename : filename.split('/').join(path.sep)
		)
	}
);
