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
TypeScript's type checker. In particular, imports and local declarations can share a name:

```typescript
import type { A } from './a';
const A = 1;
```

This also applies to ordinary imports, not only type-only imports:

```typescript
import { Config } from './types';
const Config = { path: '/' };
```

Import aliases (`import A = M`) can also share a name with local declarations. The parser does not
resolve the imported symbol or decide whether the combination is semantically valid. Use
TypeScript's checker when your application needs those diagnostics.

The parser still rejects malformed syntax and certain duplicate declarations in the same scope.
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
