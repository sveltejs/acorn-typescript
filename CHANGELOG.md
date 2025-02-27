# Changelog

## 1.0.2

### Patch Changes

- fix: support const modifier in generic type parameters ([`0c11e2b`](https://github.com/sveltejs/acorn-typescript/commit/0c11e2b0bd88d484fc978049b374c7232d75b688))

- fix: allow declaration merging ([`35e1a3b`](https://github.com/sveltejs/acorn-typescript/commit/35e1a3b157823d6d6a37621e1733ec5d64e15277))

- fix: support type annotation on rest parameters in arrow function ([`847d787`](https://github.com/sveltejs/acorn-typescript/commit/847d78793fe40075dcaa720e6311970da41c808a))

- fix: support non-null expressions in more places ([`6267f0c`](https://github.com/sveltejs/acorn-typescript/commit/6267f0cf2defaa74655e0743d3700b6b37647a8d))

## 1.0.1

### Patch Changes

- fix: parse type assertions ([#1](https://github.com/sveltejs/acorn-typescript/pull/1))

## 1.0.0 / acorn-typescript

This project started as a fork of https://github.com/TyrealHu/acorn-typescript

Version 1.0 of `@sveltejs/acorn-typescript` has some breaking changes compared to the original `acorn-typescript` project:

- Only named export (i.e. you have to do `import { tsPlugin } from '@sveltejs/acorn-typescript';`, a default export is no longer provided)
- ESM only (no CJS build)
- JSX parsing is disabled by default now (you can turn it back on by passing `{ jsx: true }`)
- `allowSatisfies` option was removed, `satisfies` operator is always parsed now
- `index` on `loc` was removed
- `typeParameters` is now `typeArguments` in some places (like `TSTypeReference`) to align with the TSESTree spec

Changelog of the project this originated from: https://github.com/TyrealHu/acorn-typescript/CHANGELOG.md
