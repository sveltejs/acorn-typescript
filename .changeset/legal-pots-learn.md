---
'@sveltejs/acorn-typescript': major
---

Emit `Identifiers` for `TSTypeParameter` names rather than raw strings.

Both TypeScript and latest Babel emit `TSTypeParameter#name` as an `Identifier`
node rather than a raw string. It makes sense that we align with that behaviour.

Any AST traversal will have to update like so:

```diff
if (node.type === 'TSTypeParameter') {
- console.log(node.name);
+ console.log(node.name.name);
}
```
