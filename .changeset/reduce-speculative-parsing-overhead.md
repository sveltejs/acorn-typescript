---
'@sveltejs/acorn-typescript': patch
---

perf: reduce speculative parsing overhead by deferring error formatting for discarded parse branches, aborting discard-only branches without constructing errors, and recognizing optional parameters with type annotations without trying a conditional expression first.
