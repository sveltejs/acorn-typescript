---
"@sveltejs/acorn-typescript": major
---

Wrap exported import-equals declarations in named declaration nodes. An `export import foo = ...` node now becomes part of an `ExportNamedDeclaration` rather than being standalone.
