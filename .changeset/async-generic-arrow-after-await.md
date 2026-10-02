---
'@sveltejs/acorn-typescript': patch
---

Parse a generic async arrow function that follows an `await` in the same function, e.g. `async function f() { await g(); const fn = async <T>(value: T) => value; }`. The earlier `await` was mistaken for one in the arrow's default parameters, so parsing fell back to a call expression and failed with "Unexpected token".
