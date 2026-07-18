import type { Token } from 'acorn';
import { describe, expect, it } from 'vitest';
import { JsxParser, Parser } from './utils';

type ParserConstructor = new (options: Record<string, any>, input: string) => any;
type TokenMode = 'callback' | 'array';

const parseOptions = {
	ecmaVersion: 'latest' as const,
	sourceType: 'module' as const,
	locations: true
};

function tokenDescription(token: Token): string {
	return `${token.type.label}:${String((token as any).value)}:${token.start}-${token.end}`;
}

function collectTokens(ParserClass: typeof Parser, input: string, mode: TokenMode = 'callback') {
	const tokens: Token[] = [];
	ParserClass.parse(input, {
		...parseOptions,
		onToken: mode === 'array' ? tokens : (token) => tokens.push(token)
	});
	return tokens;
}

function expectUniqueOrderedTokens(tokens: Token[]): void {
	const spans = tokens.map((token) => `${token.start}-${token.end}`);
	const starts = tokens.map((token) => token.start);

	expect(new Set(spans).size).toBe(spans.length);
	expect(starts).toEqual([...starts].sort((left, right) => left - right));
}

function parserStateValues(parser: any) {
	return {
		scopeBindings: parser.scopeStack.map((scope) => scope.lexical.slice()),
		imports: parser.importsStack.map((imports) => imports.slice()),
		decoratorCounts: parser.decoratorStack.map((decorators) => decorators.length),
		labels: parser.labels.map((label) => label.kind),
		privateDeclared: parser.privateNameStack.map((entry) => Object.keys(entry.declared)),
		privateUsed: parser.privateNameStack.map((entry) => entry.used.map((name) => name.name)),
		undefinedExports: Object.keys(parser.undefinedExports),
		contextDepth: parser.context.length
	};
}

describe('parse branch transactions', () => {
	describe('token provenance', () => {
		it.each(['callback', 'array'] as const)(
			'emits the selected tryParse tokens once with the %s API',
			(mode) => {
				const tokens = collectTokens(Parser, 'const f = (x): T => x;', mode);

				expectUniqueOrderedTokens(tokens);
				expect(tokens.filter((token) => token.start === 15 && token.end === 16)).toHaveLength(1);
			}
		);

		it('discards tokens emitted by a lookahead predicate', () => {
			const tokens = collectTokens(Parser, 'type F = (x: T) => T;');

			expectUniqueOrderedTokens(tokens);
			expect(tokens.filter((token) => token.start === 19 && token.end === 20)).toHaveLength(1);
		});

		it('discards the JSX alternative when a TSX generic arrow is selected', () => {
			const tokens = collectTokens(JsxParser, 'const f = <T,>(x: T) => x;', 'array');
			const typeParameterTokens = tokens.filter((token) => token.start === 11 && token.end === 12);

			expectUniqueOrderedTokens(tokens);
			expect(typeParameterTokens.map((token) => [token.type.label, (token as any).value])).toEqual([
				['name', 'T']
			]);
			expect(tokens.some((token) => token.type.label === 'jsxName')).toBe(false);
		});

		it('keeps JSX tokenization when JSX is selected', () => {
			const tokens = collectTokens(JsxParser, 'const view = <T prop="x" />;');

			expectUniqueOrderedTokens(tokens);
			expect(tokens.map(tokenDescription)).toEqual(
				expect.arrayContaining(['jsxName:T:14-15', 'jsxName:prop:16-20'])
			);
		});

		it('emits only the selected failing branch before throwing', () => {
			const tokens: Token[] = [];

			expect(() =>
				JsxParser.parse('const f = <T,>(', {
					...parseOptions,
					onToken: tokens
				})
			).toThrow('Unexpected token (1:12)');
			expect(tokens.map(tokenDescription)).toEqual([
				'const:const:0-5',
				'name:f:6-7',
				'=:=:8-9',
				'jsxTagStart:undefined:10-11',
				'jsxName:T:11-12'
			]);
		});
	});

	describe('other Acorn callbacks', () => {
		it('preserves token and comment order after discarding a JSX branch', () => {
			const events: string[] = [];
			JsxParser.parse('const f = <T /* c */,>(x: T) => x;', {
				...parseOptions,
				onToken: (token) => events.push(`token:${token.type.label}:${token.start}`),
				onComment: (_block, text, start) => events.push(`comment:${text.trim()}:${start}`)
			});

			expect(events.slice(3, 8)).toEqual([
				'token:jsxTagStart:10',
				'token:name:11',
				'comment:c:13',
				'token:,:20',
				'token:</>/<=/>=:21'
			]);
		});

		it('preserves Acorn comment-array metadata', () => {
			const comments: any[] = [];
			JsxParser.parse('const f = <T /* c */,>(x: T) => x;', {
				...parseOptions,
				ranges: true,
				sourceFile: 'input.tsx',
				onComment: comments
			});

			expect(comments).toEqual([
				expect.objectContaining({
					type: 'Block',
					value: ' c ',
					start: 13,
					end: 20,
					range: [13, 20],
					loc: expect.objectContaining({ source: 'input.tsx' })
				})
			]);
		});

		it('commits ASI and trailing-comma callbacks from the selected branch', () => {
			const insertedSemicolons: number[] = [];
			const trailingCommas: number[] = [];
			JsxParser.parse('const f = <T,>(x: T,) => {\n  x\n}', {
				...parseOptions,
				onInsertedSemicolon: (position) => insertedSemicolons.push(position),
				onTrailingComma: (position) => trailingCommas.push(position)
			});

			expect(insertedSemicolons).toEqual([30, 32]);
			expect(trailingCommas).toEqual([19]);
		});
	});

	describe('Acorn entry points', () => {
		it('uses branch transactions in parseExpressionAt', () => {
			const tokens: Token[] = [];
			Parser.parseExpressionAt('<T>(x: T): T => x', 0, {
				...parseOptions,
				onToken: tokens
			});

			expectUniqueOrderedTokens(tokens);
			expect(tokens.at(-1)?.start).toBe(16);
		});

		it('does not buffer tokenizer callbacks outside a branch transaction', () => {
			const callbacks: string[] = [];
			const tokenizer = Parser.tokenizer('x as T', {
				...parseOptions,
				onToken: (token) => callbacks.push(tokenDescription(token))
			});

			while (tokenizer.getToken().type.label !== 'eof') {
				// Consume the tokenizer so Acorn invokes every callback.
			}

			expect(callbacks).toEqual(['eof:null:0-0', 'name:x:0-1', 'name:as:2-4', 'name:T:5-6']);
		});
	});

	describe('parser state', () => {
		it('restores base and selected-branch state without changing container identities', () => {
			const ParserClass = Parser as unknown as ParserConstructor;
			const parser = new ParserClass(parseOptions, 'const value = 1;');
			const privateEntry = { declared: Object.create(null), used: [] };
			parser.labels.push({ name: 'outer', kind: null, statementStart: 0 });
			parser.privateNameStack.push(privateEntry);
			const identities = {
				scopeStack: parser.scopeStack,
				scope: parser.scopeStack[0],
				lexical: parser.scopeStack[0].lexical,
				imports: parser.importsStack[0],
				decorators: parser.decoratorStack[0],
				labels: parser.labels,
				undefinedExports: parser.undefinedExports,
				context: parser.context,
				privateEntry,
				privateDeclared: privateEntry.declared
			};
			const expectBaseContainerIdentities = () => {
				expect(parser.scopeStack).toBe(identities.scopeStack);
				expect(parser.scopeStack[0]).toBe(identities.scope);
				expect(parser.scopeStack[0].lexical).toBe(identities.lexical);
				expect(parser.importsStack[0]).toBe(identities.imports);
				expect(parser.decoratorStack[0]).toBe(identities.decorators);
				expect(parser.labels).toBe(identities.labels);
				expect(parser.undefinedExports).toBe(identities.undefinedExports);
				expect(parser.context).toBe(identities.context);
				expect(parser.privateNameStack[0]).toBe(identities.privateEntry);
				expect(parser.privateNameStack[0].declared).toBe(identities.privateDeclared);
			};
			const baseState = parser.captureParserState();

			identities.lexical.push('value');
			identities.imports.push('Imported');
			identities.decorators.push({ type: 'Decorator' });
			parser.labels[0].kind = 'loop';
			privateEntry.declared.secret = 'true';
			privateEntry.used.push({ name: 'missing' });
			parser.undefinedExports.missing = { name: 'missing' };
			parser.scopeStack.push({ flags: 0, var: [], lexical: [], functions: [] });
			parser.context.push(parser.context[0]);
			const addedScope = parser.scopeStack[1];
			const selectedState = parser.captureParserState(baseState);

			parser.restoreParserState(baseState);
			expect(parserStateValues(parser)).toEqual({
				scopeBindings: [[]],
				imports: [[]],
				decoratorCounts: [0],
				labels: [null],
				privateDeclared: [[]],
				privateUsed: [[]],
				undefinedExports: [],
				contextDepth: 1
			});
			expectBaseContainerIdentities();

			parser.restoreParserState(selectedState);
			expect(parserStateValues(parser)).toEqual({
				scopeBindings: [['value'], []],
				imports: [['Imported']],
				decoratorCounts: [1],
				labels: ['loop'],
				privateDeclared: [['secret']],
				privateUsed: [['missing']],
				undefinedExports: ['missing'],
				contextDepth: 2
			});
			expectBaseContainerIdentities();
			expect(parser.scopeStack[1]).toBe(addedScope);
		});

		it('accounts for every parser-owned property in the state audit', () => {
			const ParserClass = JsxParser as unknown as ParserConstructor;
			const parser = new ParserClass(parseOptions, 'const f = <T,>(x: T) => x;');
			parser.parse();
			const state = parser.captureParserState();
			const capturedNames = new Set([
				...Object.keys(state.lookahead),
				...Object.keys(state).filter((name) => name !== 'lookahead')
			]);
			const stableOrDisposableNames = [
				'ecmaVersion',
				'inModule',
				'input',
				'keywords',
				'options',
				'regexpState',
				'reservedWords',
				'reservedWordsStrict',
				'reservedWordsStrictBind',
				'sourceFile',
				'tsParseConstModifier'
			];
			const infrastructureNames = ['parserCallbacks', 'parseBranchFrames'];
			const accountedNames = new Set([
				...capturedNames,
				...stableOrDisposableNames,
				...infrastructureNames
			]);

			expect(Object.keys(parser).sort()).toEqual([...accountedNames].sort());
		});
	});
});
