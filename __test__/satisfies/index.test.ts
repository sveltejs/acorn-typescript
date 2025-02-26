import { describe, it } from 'vitest';
import { equalNode, parseSource } from '../utils';
import SatisfiesSnapshot from '../__snapshot__/satisfies';

describe('satisfies', function () {
	it('normal', function () {
		const node = parseSource('const a = 1 satisfies any');

		equalNode(node, SatisfiesSnapshot.Normal);
	});
});
