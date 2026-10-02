---
'@sveltejs/acorn-typescript': patch
---

Parse an anonymous default-exported class with an `implements` clause or the `abstract` modifier, e.g. `export default class implements I {}` and `export default abstract class<T> extends B {}`, matching TypeScript. An anonymous class whose first clause is `implements` now has `id: null`.
