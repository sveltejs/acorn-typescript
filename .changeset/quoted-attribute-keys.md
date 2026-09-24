---
'@sveltejs/acorn-typescript': patch
---

Compare quoted import attribute keys by value, so `with { 'a': 'x', 'b': 'y' }` parses and `with { type: 'a', 'type': 'b' }` is rejected as a duplicate.
