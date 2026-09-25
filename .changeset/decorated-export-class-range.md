---
'@sveltejs/acorn-typescript': patch
---

Start a class's range after `export` when its decorators are written before `export` (`@dec export class K {}`), so it no longer begins ahead of its export node. This matches typescript-estree.
