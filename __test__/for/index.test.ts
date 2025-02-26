import { describe, it } from 'vitest';
import { equalNode, generateSource, parseSource, parseSourceShouldThrowError } from '../utils';
import ForSnapshot from '../__snapshot__/for';

describe('for', () => {
	it('of', () => {
		const node = parseSource(
			generateSource([`const words = []`, `for (const word of words) {`, ` console.log(word)`, `}`])
		);

		equalNode(node, ForSnapshot.of);
	});
	it('in without decl', () => {
		const node = parseSource(generateSource([`for (word in words) {`, ` console.log(word)`, `}`]));

		equalNode(node, ForSnapshot.inWithoutDecl);
	});
	it('async in for of without decl', () => {
		parseSourceShouldThrowError(
			generateSource([`var async;`, `for (async of [1]) ;`]),
			'Unexpected token (2:14)'
		);
	});
});
