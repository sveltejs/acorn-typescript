---
'@sveltejs/acorn-typescript': major
---

Dynamic import attributes are now only exposed on `ImportExpression.options`, matching acorn and ESTree. They were previously exposed as `ImportExpression.arguments`, which caused ESTree printers such as esrap to print them twice. Consumers reading `node.arguments` on dynamic imports should read `node.options` instead.

Require Acorn `^8.14.0`, which introduced dynamic import options. Parsing a dynamic import with a second argument also requires `ecmaVersion: 16` (ES2025) or later, or `'latest'`; the plugin now follows Acorn's language-version gate.
