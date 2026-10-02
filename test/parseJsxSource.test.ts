import { describe, expect, it } from 'vitest';
import { parseJsxSource } from './utils.js';

function parseJsxText(text: string): string {
	const source = `const element = <div>${text}</div>;`;
	const program = parseJsxSource(source) as any;
	const declaration = program.body[0].declarations[0];
	const element = declaration.init;
	return element.children[0].value;
}

describe('JSX entity decoding', () => {
	it('leaves inherited constructor names untouched', () => {
		expect(parseJsxText('&constructor;')).toBe('&constructor;');
	});

	it('leaves out-of-range code points untouched', () => {
		expect(parseJsxText('&#x110000;')).toBe('&#x110000;');
	});

	it('continues to decode named and basic-plane entities', () => {
		expect(parseJsxText('&amp;')).toBe('&');
		expect(parseJsxText('&nbsp;')).toBe('\u00a0');
		expect(parseJsxText('&#x41;')).toBe('A');
		expect(parseJsxText('&#65;')).toBe('A');
	});
});

describe('generic arrow functions in JSX', () => {
	function arrowTypeParameter(source: string): any {
		const program = parseJsxSource(source) as any;
		return program.body[0].declarations[0].init.typeParameters.params[0];
	}

	it('accepts a single type parameter with a constraint', () => {
		const param = arrowTypeParameter('const identity = <T extends string>(value: T): T => value;');
		expect(param.constraint.type).toBe('TSStringKeyword');
	});

	it('accepts a single type parameter with a default', () => {
		const param = arrowTypeParameter('const identity = <T = string>(value: T): T => value;');
		expect(param.default.type).toBe('TSStringKeyword');
	});

	it('accepts a single type parameter with a trailing comma', () => {
		const param = arrowTypeParameter('const identity = <T,>(value: T): T => value;');
		expect(param.name).toBe('T');
	});

	it('still reserves a bare single type parameter', () => {
		expect(() => parseJsxSource('const identity = <T>(value: T): T => value;')).toThrow(
			/trailing comma/
		);
	});
});
