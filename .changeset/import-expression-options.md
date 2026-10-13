---
'@sveltejs/acorn-typescript': major
---

Dynamic import attributes are now only exposed on `ImportExpression.options`, matching acorn and ESTree. They were previously exposed as `ImportExpression.arguments`, which caused ESTree printers such as esrap to print them twice. Consumers reading `node.arguments` on dynamic imports should read `node.options` instead.
