# @sveltejs/acorn-typescript

[![License](https://img.shields.io/npm/l/svelte.svg)](LICENSE.md) [![Chat](https://img.shields.io/discord/457912077277855764?label=chat&logo=discord)](https://svelte.dev/chat)

This is a plugin for [Acorn](http://marijnhaverbeke.nl/acorn/) - a tiny, fast JavaScript parser, written completely in JavaScript.

It was created as an experimental alternative, faster [TypeScript](https://www.typescriptlang.org/) parser. It will help you to parse
TypeScript using Acorn.

## Acorn version and language version

The Acorn peer range is `^8.14.0`. Dynamic imports with a second argument, such as
`import('./data.json', { with: { type: 'json' } })`, need both Acorn's import-options support
(introduced in 8.14.0) and `ecmaVersion: 16` (ES2025) or later, or `'latest'`. They throw a syntax
error with `ecmaVersion: 15`, even on a newer Acorn version. Continue enabling `locations: true`.

`'latest'` means the latest language version implemented by your installed Acorn. Newer JavaScript
syntax may require a newer Acorn release; the peer minimum does not enable all syntax supported
by the development version. Dynamic imports without a second argument remain supported at
`ecmaVersion: 15`.

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

## SUPPORTED

- Typescript normal syntax
- Support to parse TypeScript [Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- Support to parse JSX & TSX

## CHANGELOG

[click](./CHANGELOG.md)

## Acknowledgments

We want to thank [TyrealHu](https://github.com/TyrealHu) for his original work on this project. He maintained [`acorn-typescript`](https://github.com/TyrealHu/acorn-typescript) until early 2024.
