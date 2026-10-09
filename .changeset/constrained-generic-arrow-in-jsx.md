---
'@sveltejs/acorn-typescript': patch
---

Accept a generic arrow function whose single type parameter has a constraint or default in JSX mode, e.g. `<T extends string>(value: T) => value` and `<T = string>(value: T) => value`, matching TypeScript. Only a bare `<T>(...) => ...` remains reserved.
