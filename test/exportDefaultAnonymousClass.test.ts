import { describe, expect, it } from 'vitest';
import { parseSource, parseSourceShouldThrowError } from './utils';

function defaultClass(input: string) {
	const program = parseSource(`interface I {}\ndeclare class B {}\n${input}`) as any;
	const exported = program.body.at(-1);
	expect(exported.type).toBe('ExportDefaultDeclaration');
	return exported.declaration;
}

describe('anonymous export default class', () => {
	it.each([
		'export default class implements I {}',
		'export default abstract class implements I {}',
		'export default abstract class {}',
		'export default abstract class extends B {}',
		'export default abstract class<T> {}'
	])('parses %s', (input) => {
		const declaration = defaultClass(input);
		expect(declaration.type).toBe('ClassDeclaration');
		expect(declaration.id).toBe(null);
		expect(declaration.abstract).toBe(input.includes('abstract') ? true : undefined);
	});

	it('keeps the heritage clauses and type parameters', () => {
		const declaration = defaultClass(
			'export default abstract class<T> extends B implements I { abstract m(): T; }'
		);
		expect(declaration.typeParameters.params[0].name).toBe('T');
		expect(declaration.superClass.name).toBe('B');
		expect(declaration.implements[0].expression.name).toBe('I');
		expect(declaration.body.body[0].abstract).toBe(true);
	});

	it('still binds a named abstract default export', () => {
		const declaration = defaultClass('export default abstract class A implements I {}');
		expect(declaration.id.name).toBe('A');
		parseSourceShouldThrowError(
			'export default abstract class A {}\nlet A;',
			"Identifier 'A' has already been declared (2:4)"
		);
	});

	it('still rejects `implements` as the name of a class statement', () => {
		parseSourceShouldThrowError(
			'interface I {}\nclass implements I {}',
			"The keyword 'implements' is reserved (2:6)"
		);
	});
});
