type RequireInterface = import('pkg', { with: { 'resolution-mode': 'require' } }).RequireInterface;

type ImportedX = typeof import('foo', { with: { 'resolution-mode': 'import' } }).x;

type Legacy = import('foo', { assert: { type: 'json' } }).X;

type Plain = import('foo').Bar<string>;
