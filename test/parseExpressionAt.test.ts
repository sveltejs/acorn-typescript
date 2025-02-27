import { describe, it, expect } from 'vitest';
import { generateSource, Parser } from './run.test';

function parseExpressionAt(input: string, pos: number) {
	return Parser.parseExpressionAt(input, pos, {
		sourceType: 'module',
		ecmaVersion: 'latest',
		locations: true
	});
}

describe('parseExpressionAt API', () => {
	it('normal', () => {
		const node = parseExpressionAt(generateSource([`<tag prop={`, `  (): void => {}`, `} />`]), 14);

		expect(node.type).toEqual('ArrowFunctionExpression');
	});
});
