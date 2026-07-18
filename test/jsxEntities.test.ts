import * as acorn from 'acorn';
import { describe, expect, it } from 'vitest';
import { tsPlugin } from '../src';

const Parser = acorn.Parser.extend(tsPlugin({ jsx: true }) as any);

function parseJsxText(source: string): string {
	const ast = Parser.parse(source, {
		ecmaVersion: 'latest',
		sourceType: 'module'
	});

	const values: string[] = [];
	const visit = (node: any) => {
		if (!node || typeof node !== 'object') return;
		if (node.type === 'JSXText') values.push(node.value);
		for (const key of Object.keys(node)) {
			const value = node[key];
			if (Array.isArray(value)) value.forEach(visit);
			else if (value && typeof value === 'object') visit(value);
		}
	};
	visit(ast);

	return values.join('');
}

describe('jsx entities', () => {
	it('decodes a numeric entity outside the basic plane', () => {
		// `String.fromCharCode` kept only the low 16 bits, turning this into U+F600.
		expect(parseJsxText('const a = <div>&#x1f600;</div>;')).toBe('\u{1f600}');
		expect(parseJsxText('const a = <div>&#128512;</div>;')).toBe('\u{1f600}');
	});

	it('leaves an inherited property name untouched', () => {
		// A bare lookup found these on Object.prototype, so they resolved to
		// functions instead of staying literal text.
		expect(parseJsxText('const a = <div>&toString;</div>;')).toBe('&toString;');
		expect(parseJsxText('const a = <div>&constructor;</div>;')).toBe('&constructor;');
		expect(parseJsxText('const a = <div>&__proto__;</div>;')).toBe('&__proto__;');
	});

	it('still decodes named and basic-plane entities', () => {
		expect(parseJsxText('const a = <div>&amp;</div>;')).toBe('&');
		expect(parseJsxText('const a = <div>&nbsp;</div>;')).toBe(' ');
		expect(parseJsxText('const a = <div>&#x41;</div>;')).toBe('A');
		expect(parseJsxText('const a = <div>&#65;</div>;')).toBe('A');
	});

	it('leaves an out-of-range code point as written', () => {
		expect(parseJsxText('const a = <div>&#x110000;</div>;')).toBe('&#x110000;');
	});

	it('reproduces the reported example', () => {
		expect(parseJsxText('const element = <div>&#x1f600; &toString;</div>;')).toBe(
			'\u{1f600} &toString;'
		);
	});
});
