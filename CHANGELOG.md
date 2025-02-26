# Changelog

## 1.0.1

### Patch Changes

- fix: parse type assertions ([#1](https://github.com/sveltejs/acorn-typescript/pull/1))

## 1.0.0 / acorn-typescript

This project started as a fork of https://github.com/TyrealHu/acorn-typescript

Version 1.0 of `@sveltejs/acorn-typescript` has some breaking changes compared to the original `acorn-typescript` project:

- Only named export (i.e. you have to do `import { tsPlugin } from '@sveltejs/acorn-typescript';`, a default export is no longer provided)
- ESM only (no CJS build)

Changelog of the project this originated from: https://github.com/TyrealHu/acorn-typescript/CHANGELOG.md
