---
'@sveltejs/acorn-typescript': patch
---

Reduce speculative parsing overhead: defer formatting errors from discarded parse branches, abort discard-only branches without constructing errors, and recognize optional parameters with type annotations without trying a conditional expression first.
