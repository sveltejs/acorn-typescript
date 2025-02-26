import { describe, it } from 'vitest';
import { equalNode, parseSourceAllowSatisfies, parseSourceShouldThrowError } from '../utils';
import SatisfiesSnapshot from '../__snapshot__/satisfies';

describe('satisfies', function () {
	it('normal', function () {
		const node = parseSourceAllowSatisfies('const a = 1 satisfies any');

		equalNode(node, SatisfiesSnapshot.Normal);
	});

	it('should error', function () {
		parseSourceShouldThrowError('const a = 1 satisfies any', 'Unexpected token (1:12)');
	});
});
