import * as fs from 'fs';
import * as path from 'path';
import { describe } from 'vitest';
import { it } from 'vitest';
import {
	equalNode,
	parseDtsSource,
	parseJsxSource,
	parseSource,
	parseSourceShouldThrowError
} from './utils';

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

					try {
						equalNode(parsed_result, expected_result);
					} catch (e) {
						if (process.env.UPDATE_SNAPSHOT) {
							fs.writeFileSync(expected_path, JSON.stringify(parsed_result, null, 2));
						} else {
							throw e;
						}
					}
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
