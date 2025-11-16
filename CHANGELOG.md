# Changelog

## 1.0.7

### Patch Changes

- fix: support mixed labeled and unlabeled tuple types ([#24](https://github.com/sveltejs/acorn-typescript/pull/24))

## 1.0.6

### Patch Changes

- fix: correctly parse async arrow functions with generics ([#19](https://github.com/sveltejs/acorn-typescript/pull/19))

- perf: avoid garbage collection in token type utilities. ([#18](https://github.com/sveltejs/acorn-typescript/pull/18))

- fix: support `export type *` ([#10](https://github.com/sveltejs/acorn-typescript/pull/10))

## 1.0.5

### Patch Changes

- fix: allow type casts during reassignments ([`57b6335`](https://github.com/sveltejs/acorn-typescript/commit/57b63356d7e3bf24315142cde6e1b263f03ef515))

## 1.0.4

### Patch Changes

- fix: ensure scope is entered correctly ([`1697562`](https://github.com/sveltejs/acorn-typescript/commit/16975621b44b3f2838f6d1a9bac6197f87c49570))

## 1.0.3

### Patch Changes

- fix: allow override modifier in class that extends another class ([`cd3843e`](https://github.com/sveltejs/acorn-typescript/commit/cd3843e85e0d83dc9f75445d908eb0101f7b4d2a))

- fix: avoid validating arrow function parameters too early ([`f184d66`](https://github.com/sveltejs/acorn-typescript/commit/f184d66c339d00ee7103a9a24595bed76ddf19b0))

- fix: handle class/function identifier names inside template literal ([`8819aa1`](https://github.com/sveltejs/acorn-typescript/commit/8819aa10cbc086d11aa94a728cd7f80674f31ff3))

- fix: typeParameters->typeArguments in some places to align with TSESTree spec ([`bc39dcb`](https://github.com/sveltejs/acorn-typescript/commit/bc39dcb0702c9ccd563abba2a3d5d9d9d58e4104))

- fix: correct end position, remove obsolete index ([`f35b64e`](https://github.com/sveltejs/acorn-typescript/commit/f35b64eb74d2acaa63f464728d9962dada9c5b6f))

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
