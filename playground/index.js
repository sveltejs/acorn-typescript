import * as fs from 'fs';
import * as acorn from 'acorn';
import { tsPlugin } from '../index.js';

const parser = acorn.Parser.extend(tsPlugin());

const content = fs.readFileSync('playground/input.ts', 'utf8');
const output = parser.parse(content, {
	sourceType: 'module',
	ecmaVersion: 'latest',
	locations: true
});

fs.writeFileSync('playground/output.json', JSON.stringify(output, null, 4));
