---
"@sveltejs/acorn-typescript": major
---

Change function signatures to have `params` rather than `parameters` so we match TSESTree's behaviour. Similarly, change the return type to be `returnType` rather than `typeAnnotation`.
