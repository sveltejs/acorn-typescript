# Migrating from v1 to v2

This guide covers upgrading `@sveltejs/acorn-typescript` from v1 (verified with `1.0.13`)
to v2. The [major changeset](https://github.com/sveltejs/acorn-typescript/blob/8857b501d0eccaec896e731b530ba4a76bdbfd4e/.changeset/import-expression-options.md) introduced by
[PR #110](https://github.com/sveltejs/acorn-typescript/pull/110) changes the AST for dynamic
imports. The examples below were verified against the implementation at
[`85a27a0`](https://github.com/sveltejs/acorn-typescript/commit/85a27a0) intended for v2;
[release PR #108](https://github.com/sveltejs/acorn-typescript/pull/108) currently proposes `2.0.0`.

## Update dynamic import AST consumers

For this source:

```javascript
import('./data.json', { with: { type: 'json' } });
```

The first argument stays in `ImportExpression.source`. The second argument moves from the
plugin-specific `arguments[0]` field to Acorn's `options` field:

| Field            | v1                                      | v2                              |
| ---------------- | --------------------------------------- | ------------------------------- |
| `node.source`    | The module specifier expression         | The module specifier expression |
| `node.arguments` | An array containing the second argument | Not emitted                     |
| `node.options`   | Not emitted                             | The second argument expression  |

`arguments[0]` in v1 is **not** the module specifier. Unlike a `CallExpression`, an
`ImportExpression` stores that expression separately in `source`.

Replace reads of the second argument:

```javascript
// v1
const importOptions = node.arguments?.[0];

// v2
const importOptions = node.options;
```

For `import('./data.json')`, there is no second argument. With Acorn 8.14.0 or 8.18.0 and
`ecmaVersion: 16` or `'latest'`, v2 emits `options: null`; v1 omits both `options` and
`arguments`. Handle absent options without assuming an object expression is always present.

If your tool needs to read both v1 and v2 ASTs, use a small compatibility helper:

```javascript
function getImportOptions(node) {
	return node.options ?? node.arguments?.[0] ?? null;
}
```

This prefers the v2 field and falls back to the v1 field. Keep this compatibility logic in
your consumer rather than adding an `arguments` alias to a v2 AST.

### Walkers and printers

Update your `ImportExpression` visitor to visit `source` and the options expression once:

```javascript
function visitImportExpression(node, visit) {
	visit(node.source);
	const options = getImportOptions(node);
	if (options != null) visit(options);
}
```

Replace the existing handler with this one; do not also traverse `node.arguments` in that
handler. Likewise, a printer should print `node.source` as the first argument and the result of
`getImportOptions(node)` as the optional second argument, once. Do not synthesize both fields:
a printer that recognizes both can output the second argument twice.

Review custom visitor keys, AST types, transforms, serialized ASTs and snapshots that refer to
`ImportExpression.arguments`. This change applies to dynamic import expressions, not to
`CallExpression.arguments`, static `ImportDeclaration` attributes, or TypeScript import types.
Verify your own walker/printer integration; this guide does not establish compatibility with
specific Svelte or esrap versions.

## Check Acorn and `ecmaVersion` together

V2 delegates dynamic import parsing to Acorn. V1 accepted a second argument independently of
Acorn's import-options syntax gate; v2 follows Acorn's gate. Merely changing the AST field is
insufficient if your parser configuration rejects the source.

The following combinations were checked with published v1.0.13 and the v2 implementation on
`main`, using `locations: true` and `sourceType: 'module'`:

| Acorn          | `ecmaVersion`             | v1: `import('x', {})` | v2: `import('x', {})`                  |
| -------------- | ------------------------- | --------------------- | -------------------------------------- |
| 8.9.0, 8.13.0  | `15`, `16`, `'latest'`    | Accepted              | Syntax error                           |
| 8.14.0, 8.18.0 | `15` (ES2024)             | Accepted              | Syntax error                           |
| 8.14.0, 8.18.0 | `16` (ES2025), `'latest'` | Accepted              | Accepted; second argument in `options` |

Acorn added import-options support in 8.14.0. Use an Acorn version supporting that syntax and
`ecmaVersion: 16` or later (or `'latest'`) if you parse dynamic imports with a second argument.
`'latest'` depends on the installed Acorn version: it does not enable import options in 8.9.0
or 8.13.0. A dynamic import with only a module specifier still parses in all combinations above.
With Acorn 8.14.0 or 8.18.0 and `ecmaVersion: 16` or `'latest'`, v2 also accepts a trailing comma
after the second argument, which v1.0.13 rejected.

For example, with Acorn 8.18.0:

```javascript
import { Parser } from 'acorn';
import { tsPlugin } from '@sveltejs/acorn-typescript';

const TypeScriptParser = Parser.extend(tsPlugin());
const ast = TypeScriptParser.parse("import('./data.json', { with: { type: 'json' } })", {
	sourceType: 'module',
	ecmaVersion: 16,
	locations: true
});

const node = ast.body[0].expression;
console.log(node.source.value); // './data.json'
console.log(node.options.type); // 'ObjectExpression'
```

The `tsPlugin` import and `Parser.extend(tsPlugin())` setup remain the same. Continue enabling
`locations: true` as described in the [README](./README.md#usage).

### Before the v2 release

At the time of writing, both `main` and release PR #108 still declare the Acorn peer range as
`^8.9.0`, while development uses `^8.18.0`. That peer range includes versions that cannot parse
dynamic import options in v2. A minimum-version update and regression matrix are proposed separately in
[PR #163](https://github.com/sveltejs/acorn-typescript/pull/163). Confirm the final supported
Acorn version and published peer range before releasing v2. The verified syntax requirement above
is not a declaration of a newly agreed package-wide minimum; this guide does not change the
dependency range.

## Review assumptions about name conflicts

V2 accepts more combinations of imports and local declarations. For example, these previously
rejected cases now produce an AST:

```typescript
import type { A } from './a';
const A = 1;
```

```typescript
import { Config } from './types';
const Config = { path: '/' };
```

The second example uses an ordinary import, so this change is broader than just type-only
imports. Parsing does not resolve the imported symbol or determine whether the combination is
valid TypeScript. If your application used a parser exception to diagnose these conflicts, use
TypeScript's checker for semantic validation.

This does not remove all declaration checks: duplicate import bindings, duplicate `const`
declarations, duplicate type aliases in the same scope, and malformed syntax still throw.
See the separate [README validation-scope clarification](https://github.com/sveltejs/acorn-typescript/pull/162)
for the ongoing policy.

## Verify your upgrade

- Parse dynamic imports with and without a second argument using your installed Acorn and
  configured `ecmaVersion`.
- Update AST expectations to read `options`, keeping the module specifier in `source`.
- Confirm your walker visits the options expression once and your printer emits it once.
- If you support both major versions, exercise the compatibility helper on both AST shapes.
- Run TypeScript checking separately wherever you need semantic diagnostics for import/local
  name conflicts.
