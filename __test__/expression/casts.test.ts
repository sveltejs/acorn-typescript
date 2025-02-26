import { describe, it } from 'vitest';
import TypeCastsSnapshot from '../__snapshot__/expression/casts';
import { equalNode, generateSource, parseSource } from '../utils';

describe('type casts', () => {
	describe('in variable declarations', () => {
		it('1 as  number', () => {
			const node = parseSource(generateSource([`let test = 1 as number`]));

			equalNode(node, TypeCastsSnapshot.OneAsNumber);
		});

		it('<number>1', () => {
			const node = parseSource(generateSource([`let test = <number>1`]));

			equalNode(node, TypeCastsSnapshot.OneCastNumber);
		});
	});

	describe('in labeled statements', () => {
		it('1 as  number', () => {
			const node = parseSource(generateSource([`$: test = 1 as number`]));

			equalNode(node, TypeCastsSnapshot.LabeledOneAsNumber);
		});

		it('<number>1', () => {
			const node = parseSource(generateSource([`$: test = <number>1`]));

			equalNode(node, TypeCastsSnapshot.LabeledOneCastNumber);
		});
	});

	describe('in expressions', () => {
		it('1 as  number', () => {
			const node = parseSource(generateSource([`foo(1 as number)`]));

			equalNode(node, TypeCastsSnapshot.ExpressionOneAsNumber);
		});

		it('<number>1', () => {
			const node = parseSource(generateSource([`foo(<number>1)`]));

			equalNode(node, TypeCastsSnapshot.ExpressionOneCastNumber);
		});
	});
});
