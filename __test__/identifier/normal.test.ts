import { describe, it } from 'vitest';
import { equalNode, generateSource, parseSource, parseSourceShouldThrowError } from '../utils';
import NormalIdentifierSnapshot from '../__snapshot__/identifier/normal';

describe('normal identifier test', () => {
	it('export identifier `as`', () => {
		const node = parseSource(generateSource([`var foo = 8;`, `export { foo as as };`]));

		equalNode(node, NormalIdentifierSnapshot.ExportIdentifierAs);
	});

	it('import identifier `as`', () => {
		const node = parseSource(generateSource([`import { as as as } from './foo.js';`]));

		equalNode(node, NormalIdentifierSnapshot.ImportIdentifierAs);
	});

	it('type/value same name #1', () => {
		const node = parseSource(generateSource([`type abc = 1234;`, `var abc;`]));

		equalNode(node, NormalIdentifierSnapshot.TypeNameSame1);
	});

	it('type/identifier same name #2', () => {
		const node = parseSource(generateSource([`type abc = 1234;`, `let abc;`]));

		equalNode(node, NormalIdentifierSnapshot.TypeNameSame2);
	});

	it('type/identifier same name #3', () => {
		const node = parseSource(generateSource([`type abc = 1234;`, `function abc() {}`]));

		equalNode(node, NormalIdentifierSnapshot.TypeNameSame3);
	});

	it('interface merging', () => {
		const node = parseSource(generateSource([`interface abc {}`, `interface abc {}`]));

		equalNode(node, NormalIdentifierSnapshot.InterfaceMerging);
	});

	it('identifier multiple times error #1', () => {
		parseSourceShouldThrowError(
			generateSource([`let abc = 1234;`, `function abc() {}`]),
			"Identifier 'abc' has already been declared (2:9)"
		);
	});

	it('identifier multiple times error #2', () => {
		parseSourceShouldThrowError(
			generateSource([`type abc = 1234;`, `type abc = 'hi';`]),
			"type 'abc' has already been declared. (2:5)"
		);
	});
});
