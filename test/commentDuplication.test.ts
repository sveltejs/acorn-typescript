import { describe, it, expect } from 'vitest';
import { Parser } from './utils';

/**
 * Parse `input` and return the highest number of times any single comment span
 * was reported to `onComment`.
 *
 * Every input below contains exactly one comment, so the result should be `1`:
 * a `2`+ means it was double-reported, and a `0` means it was dropped.
 */
function maxEmissions(input: string): number {
	const counts = new Map<string, number>();
	Parser.parse(input, {
		sourceType: 'module',
		ecmaVersion: 'latest',
		onComment: (_block: boolean, text: string, start: number, end: number) => {
			const key = `${start},${end}::${text}`;
			counts.set(key, (counts.get(key) ?? 0) + 1);
		}
	});
	return Math.max(0, ...counts.values());
}

describe('comment duplication (onComment double-fire)', () => {
	// `tsLookAhead` predicate paths: a pure peek re-lexes a region while
	// classifying it but never sets `isLookahead`, so the re-lexed comments leak
	describe('tsLookAhead predicates', () => {
		it('computed class key', () => {
			expect(maxEmissions('class C { [ /* c */ foo ]() {} }')).toBe(1);
		});

		it('index signature (interface)', () => {
			expect(maxEmissions('interface I { [/* c */ k: string]: number }')).toBe(1);
		});

		it('index signature (type literal)', () => {
			expect(maxEmissions('type T = { [/* c */ k: string]: number };')).toBe(1);
		});

		it('function type parameter', () => {
			expect(maxEmissions('type F = (/* c */ a: number) => void;')).toBe(1);
		});
	});

	// `tryParse` backtrack paths: a speculative parse keeps its result on success,
	// so its comments cannot be blanket-suppressed, and only dedup/restore fixes them.
	describe('tryParse backtracking', () => {
		it('arrow return type', () => {
			expect(maxEmissions('const f = (x): T /* c */ => 0;')).toBe(1);
		});

		it('angle-bracket type assertion', () => {
			expect(maxEmissions('const x = </* c */ T>y;')).toBe(1);
		});

		it('method signature return type before `;`', () => {
			expect(maxEmissions('interface I { m(): T /* c */; }')).toBe(1);
		});

		it('abstract method return type before `;`', () => {
			expect(maxEmissions('abstract class C { abstract m(): T /* c */; }')).toBe(1);
		});

		it('function return type before `{` body', () => {
			expect(maxEmissions('function f(): T /* c */ {}')).toBe(1);
		});
	});

	// guard against an overly-aggressive fix that drops or suppresses legitimate comments
	describe('controls (must already be single)', () => {
		it('comment after a statement', () => {
			expect(maxEmissions('const x = 1; /* c */')).toBe(1);
		});

		it('`as` expression (no backtrack)', () => {
			expect(maxEmissions('const x = y as T /* c */;')).toBe(1);
		});

		it('plain typed parameter (no re-parse)', () => {
			expect(maxEmissions('function f(a: number /* c */) {}')).toBe(1);
		});
	});
});
