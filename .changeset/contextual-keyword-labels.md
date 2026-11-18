---
'@sveltejs/acorn-typescript': patch
---

Accept TypeScript contextual keywords (`type`, `declare`, `module`, ...) as statement, `break` and `continue` labels and as unparenthesized `async` arrow parameters, and parse `async as T` / `async satisfies T` as expressions.
