---
'@sveltejs/acorn-typescript': patch
---

Restore scope state after a failed speculative parse, so a leaked scope no longer causes a later `export { x }` to fail with "Export 'x' is not defined".
