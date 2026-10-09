# @sveltejs/acorn-typescript

[![License](https://img.shields.io/npm/l/svelte.svg)](LICENSE.md) [![Chat](https://img.shields.io/discord/457912077277855764?label=chat&logo=discord)](https://svelte.dev/chat)

This is a plugin for [Acorn](http://marijnhaverbeke.nl/acorn/) - a tiny, fast JavaScript parser, written completely in JavaScript.

It was created as an experimental alternative, faster [TypeScript](https://www.typescriptlang.org/) parser. It will help you to parse
TypeScript using Acorn.

## Usage

To get started, import the plugin and use Acorn's extension mechanism to register it. You have to enable `options.locations` while using `@sveltejs/acorn-typescript`.

```typescript
import { Parser } from 'acorn';
import { tsPlugin } from '@sveltejs/acorn-typescript';

const node = Parser.extend(tsPlugin()).parse(
	`
const a = 1
type A = number
export {
  a,
  type A as B
}
`,
	{
		sourceType: 'module',
		ecmaVersion: 'latest',
		locations: true
	}
);
```

If you want to enable parsing within a TypeScript ambient context, where certain syntax have different rules (like `.d.ts` files and inside [declare module blocks](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)):

```typescript
import { Parser } from 'acorn';
import { tsPlugin } from '@sveltejs/acorn-typescript';

const node = Parser.extend(tsPlugin({ dts: true })).parse(
	`
const a = 1
type A = number
export {
  a,
  type A as B
}
`,
	{
		sourceType: 'module',
		ecmaVersion: 'latest',
		locations: true
	}
);
```

## Parser responsibilities

This plugin produces a syntax tree; successful parsing does not mean that a program passes
TypeScript's type checker. Imports and local declarations can share a name, because an imported
type and a local value live in separate declaration spaces. For example, this is valid TypeScript:

```typescript
import type { A } from './a';
const A = 1;
```

This also applies to ordinary imports, not only type-only imports. The following is valid when
`Config` is exported from `./types` as a type only:

```typescript
import { Config } from './types';
const Config = { path: '/' };
```

The parser does not know whether an imported name refers to a type or a value, so it also accepts
the same code when `Config` is exported as a value, even though TypeScript's checker then reports
`Import declaration conflicts with local declaration of 'Config'`.

Internal import aliases (`import A = M`) and type-only external aliases (`import type A = require('a')`)
can also share a name with local declarations. Ordinary external aliases (`import A = require('a')`)
still use lexical binding checks and cannot share a name with a `const` in the same scope. The parser
does not resolve the imported symbol or decide whether an accepted combination is semantically valid.
Use TypeScript's checker when your application needs those diagnostics.

An ordinary import and a type-only named import can also share a binding name. The parser still
rejects malformed syntax and certain duplicate declarations in the same scope.
For example, each of the following throws a parser error:

```typescript
import { A } from './a';
import { A } from './b';
```

```typescript
const A = 1;
const A = 2;
```

```typescript
type A = number;
type A = string;
```

These examples describe the scope of the import/local-name checks, rather than a complete list of
the parser's syntax and declaration checks.

## SUPPORTED

- Typescript normal syntax
- Support to parse TypeScript [Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- Support to parse JSX & TSX

## CHANGELOG

[click](./CHANGELOG.md)

## Acknowledgments

We want to thank [TyrealHu](https://github.com/TyrealHu) for his original work on this project. He maintained [`acorn-typescript`](https://github.com/TyrealHu/acorn-typescript) until early 2024.
