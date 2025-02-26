import { assert } from 'vitest';
import * as acorn from 'acorn';
import { tsPlugin } from '../src';

export const Parser = acorn.Parser.extend(tsPlugin());

export const DtsParser = acorn.Parser.extend(
	tsPlugin({
		dts: true
	})
);

export const JsxParser = acorn.Parser.extend(
	tsPlugin({
		jsx: true
	})
);

export function equalNode(node, snapshot) {
	assert.deepEqual(JSON.parse(JSON.stringify(node)), snapshot, 'should be' + JSON.stringify(node));
}

export function parseDtsSource(input: string) {
	return DtsParser.parse(input, {
		sourceType: 'module',
		ecmaVersion: 'latest',
		locations: true
	});
}

export function parseJsxSource(input: string) {
	return JsxParser.parse(input, {
		sourceType: 'module',
		ecmaVersion: 'latest',
		locations: true
	});
}

export function parseSource(input: string) {
	return Parser.parse(input, {
		sourceType: 'module',
		ecmaVersion: 'latest',
		locations: true
	});
}

export function parseSourceShouldThrowError(input: string, message?: string) {
	try {
		Parser.parse(input, {
			sourceType: 'module',
			ecmaVersion: 'latest',
			locations: true
		});

		assert.fail('should throw an error');
	} catch (e) {
		if (message) {
			assert.equal(e.message, message);
		}
	}
}

export function generateSource(input: string[]): string {
	return input.join('\n');
}
