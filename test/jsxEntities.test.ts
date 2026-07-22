import { describe, expect, it } from 'vitest';
import { parseJsxSource } from './utils';

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
