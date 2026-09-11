import defer * as ns from './a.js';
import defer from './b.js';

export type X = { foo: ns.Foo };
export const y = defer;
