import { describe, it, expect } from 'vitest';
import * as acorn from 'acorn';
import { tsPlugin } from '../src';

const Parser = acorn.Parser.extend(tsPlugin() as any);

function parseScript(input: string) {
	return Parser.parse(input, {
		sourceType: 'script',
		ecmaVersion: 'latest',
		locations: true
	});
}

describe('import alias in a script', () => {
	it('parses an import alias without sourceType: module', () => {
		const ast: any = parseScript('declare namespace foo { const bar: any; }\nimport A = foo.bar;');

		expect(ast.body[1].type).toBe('TSImportEqualsDeclaration');
	});

	it('allows await as the alias name outside a module', () => {
		const ast: any = parseScript(
			'declare namespace foo { const await: any; }\nimport await = foo.await;'
		);

		expect(ast.body[1].type).toBe('TSImportEqualsDeclaration');
		expect(ast.body[1].id.name).toBe('await');
	});

	it('parses a type-only import alias', () => {
		const ast: any = parseScript("import type A = require('a');");

		expect(ast.body[0].type).toBe('TSImportEqualsDeclaration');
		expect(ast.body[0].importKind).toBe('type');
	});

	it('still rejects an import declaration in a script', () => {
		expect(() => parseScript("import { a } from 'a';")).toThrow(/sourceType: module/);
	});
});
