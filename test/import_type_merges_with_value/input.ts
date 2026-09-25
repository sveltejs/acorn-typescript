import type { A } from './a';
const A: A = 'a';

import { type B } from './b';
const B = 1;

import type { C as D } from './c';
function D() {}

export { A, B, D };
