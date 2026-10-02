import { describe, expect, it } from 'vitest';
import * as acorn from 'acorn';
import * as acorn89 from 'acorn-v8-9';
import * as acorn813 from 'acorn-v8-13';
import * as acorn814 from 'acorn-v8-14';
import { tsPlugin } from '../src/index.js';

// The aliases pin the peer boundary and earlier versions. The regular dependency
// exercises the Acorn version used by the rest of the regression suite.
const versions = [
	{ name: '8.9.0 (below peer minimum)', base: acorn89.Parser, supportsOptions: false },
	{ name: '8.13.0 (below peer minimum)', base: acorn813.Parser, supportsOptions: false },
	{ name: '8.14.0 (peer minimum)', base: acorn814.Parser, supportsOptions: true },
	{ name: `${acorn.version} (development)`, base: acorn.Parser, supportsOptions: true }
];

for (const { name, base, supportsOptions } of versions) {
	describe(`dynamic imports with Acorn ${name}`, () => {
		// Older Acorn declarations have a smaller ecmaVersion union. The matrix
		// intentionally passes 16/latest to their runtime to verify the version gate.
		const parser = (base as typeof acorn.Parser).extend(tsPlugin());
		for (const ecmaVersion of [15, 16, 'latest'] as const) {
			describe(`ecmaVersion: ${ecmaVersion}`, () => {
				const options = { sourceType: 'module', ecmaVersion, locations: true } as const;
				const enabled = supportsOptions && ecmaVersion !== 15;

				it('parses a dynamic import without a second argument', () => {
					const node = (parser.parse("import('./data.json')", options).body[0] as any).expression;
					expect(node.type).toBe('ImportExpression');
					expect(node.source.value).toBe('./data.json');
					expect(node).not.toHaveProperty('arguments');
					if (enabled) expect(node.options).toBeNull();
					else expect(node).not.toHaveProperty('options');
				});

				it('follows Acorn version and ecmaVersion gates for the second argument', () => {
					const parse = () =>
						parser.parse("import('./data.json', { with: { type: 'json' } })", options);
					if (!enabled) {
						expect(parse).toThrow(SyntaxError);
						return;
					}
					const node = (parse().body[0] as any).expression;
					expect(node.type).toBe('ImportExpression');
					expect(node.source.value).toBe('./data.json');
					expect(node.options.type).toBe('ObjectExpression');
					expect(node.options.properties[0].key.name).toBe('with');
					expect(node.options.properties[0].value.properties[0].value.value).toBe('json');
					expect(node).not.toHaveProperty('arguments');
				});

				it('follows the same gates for a trailing comma after the second argument', () => {
					const parse = () => parser.parse("import('./data.json', {},)", options);
					if (enabled) expect(parse).not.toThrow();
					else expect(parse).toThrow(SyntaxError);
				});

				it('still parses TypeScript declarations', () => {
					const ast = parser.parse('const value: number = 1; type A = number;', options);
					expect(ast.body.map((node) => node.type)).toEqual([
						'VariableDeclaration',
						'TSTypeAliasDeclaration'
					]);
				});
			});
		}
	});
}
