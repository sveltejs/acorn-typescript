import { assert } from 'vitest';
import * as acorn from 'acorn';
import { tsPlugin } from '../src';
import * as fs from 'fs';
import * as path from 'path';
import { describe } from 'vitest';
import { it } from 'vitest';

export const Parser = acorn.Parser.extend(tsPlugin() as any);

export const DtsParser = acorn.Parser.extend(
	tsPlugin({
		dts: true
	}) as any
);

export const JsxParser = acorn.Parser.extend(
	tsPlugin({
		jsx: true
	}) as any
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

describe('tests', () => {
	fs.readdirSync(__dirname, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.forEach((dirent) => {
			const folder_path = path.join(__dirname, dirent.name);
			const input_path = path.join(folder_path, 'input.ts');
			const expected_path = path.join(folder_path, 'expected.json');
			const error_path = path.join(folder_path, 'error.txt');

			if (fs.existsSync(expected_path)) {
				it(dirent.name, () => {
					const input_code = fs.readFileSync(input_path, 'utf-8');
					const expected_result = JSON.parse(fs.readFileSync(expected_path, 'utf-8'));

					const parsed_result = dirent.name.startsWith('jsx_')
						? parseJsxSource(input_code)
						: dirent.name.startsWith('dts_')
							? parseDtsSource(input_code)
							: parseSource(input_code);

					equalNode(parsed_result, expected_result);
				});
			} else if (fs.existsSync(error_path)) {
				it(dirent.name, () => {
					const input_code = fs.readFileSync(input_path, 'utf-8');
					const error_message = fs.readFileSync(error_path, 'utf-8').trim();

					parseSourceShouldThrowError(input_code, error_message);
				});
			} else {
				throw new Error('No expected result or error file found for ' + dirent.name);
			}
		});
});
