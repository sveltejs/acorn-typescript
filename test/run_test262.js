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
	'test/language/punctuators/S7.7_A1.js'
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
	'staging/sm/module/module-export-name-star.js'
].flatMap((s) => [s + ' (default)', s + ' (strict mode)']);

// Acorn rejects a call expression as an assignment target, which Annex B allows in
// sloppy mode only; these are (default) entries for that reason. Acorn's own
// test262 whitelist holds exactly this set, so the behaviour is inherited rather
// than ours. See https://github.com/acornjs/acorn/issues/1398.
WHITELIST.push(
	...[
		'annexB/language/expressions/assignmenttargettype/callexpression.js',
		'annexB/language/expressions/assignmenttargettype/callexpression-as-for-in-lhs.js',
		'annexB/language/expressions/assignmenttargettype/callexpression-as-for-of-lhs.js',
		'annexB/language/expressions/assignmenttargettype/callexpression-in-compound-assignment.js',
		'annexB/language/expressions/assignmenttargettype/callexpression-in-postfix-update.js',
		'annexB/language/expressions/assignmenttargettype/callexpression-in-prefix-update.js',
		'annexB/language/expressions/assignmenttargettype/cover-callexpression-and-asyncarrowhead.js'
	].map((s) => s + ' (default)')
);

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
