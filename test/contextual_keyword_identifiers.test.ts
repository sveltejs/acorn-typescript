import { describe, it, expect } from 'vitest';
import { parseSource } from './utils.js';

const words = [
	'abstract',
	'assert',
	'asserts',
	'declare',
	'global',
	'keyof',
	'module',
	'namespace',
	'readonly',
	'type',
	'unique'
];

describe('contextual keywords as identifiers', () => {
	for (const word of words) {
		it(`accepts "${word}" as a statement label`, () => {
			const ast: any = parseSource(`${word}: for (;;) break ${word};`);
			expect(ast.body[0].type).toBe('LabeledStatement');
			expect(ast.body[0].label.name).toBe(word);
			expect(ast.body[0].body.body.label.name).toBe(word);
		});

		it(`accepts "${word}" in continue`, () => {
			const ast: any = parseSource(`${word}: for (;;) { continue ${word}; }`);
			expect(ast.body[0].type).toBe('LabeledStatement');
		});

		it(`accepts "${word}" as an unparenthesized async arrow parameter`, () => {
			const ast: any = parseSource(`["a"].map(async ${word} => ${word});`);
			const arrow = ast.body[0].expression.arguments[0];
			expect(arrow.type).toBe('ArrowFunctionExpression');
			expect(arrow.async).toBe(true);
			expect(arrow.params[0].name).toBe(word);
		});
	}

	it('parses `async as T` and `async satisfies T` as expressions', () => {
		const as: any = parseSource('const async = 1; const x = async as number;');
		expect(as.body[1].declarations[0].init.type).toBe('TSAsExpression');
		const sat: any = parseSource('const async = 1; const y = async satisfies number;');
		expect(sat.body[1].declarations[0].init.type).toBe('TSSatisfiesExpression');
	});

	it('still parses declarations that start with contextual keywords', () => {
		expect(() => parseSource('type A = number; declare const b: A; namespace N {}')).not.toThrow();
		expect(() => parseSource('a ? type : declare;')).not.toThrow();
	});
});
