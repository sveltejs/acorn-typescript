---
'@sveltejs/acorn-typescript': patch
---

Fix JSX entity decoding: decode numeric entities above the basic multilingual plane, and stop resolving named entities through the prototype chain.
