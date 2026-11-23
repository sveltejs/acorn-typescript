import { expect, it } from 'vitest';
import { parseSource } from './utils.js';

it.each([
	'type Example = { <const T>(value: T): T }',
	'type Example = { method<const T>(value: T): T }',
	'type Example = <const T>(value: T) => T'
])('parses const type parameters in %s', (source) => {
	expect(() => parseSource(source)).not.toThrow();
});
