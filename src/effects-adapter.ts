import type { Options } from 'acorn';
import type { AcornParseClass } from './middleware';
import { ParseEffects, type ParseEffectState } from './effects';
import type { LookaheadState } from './types';

type ParserCheckpoint = {
	lookahead: LookaheadState;
	context: any[];
	contextLength: number;
	scopeStack: any[];
	scopeStackLength: number;
	importsStack: any[];
	importsStackLength: number;
	labels: any[];
	labelsLength: number;
	privateNameStack: any[];
	privateNameStackLength: number;
	decoratorStack: any[];
	decoratorStackLength: number;
	strict: boolean;
	potentialArrowAt: number;
	potentialArrowInForAwait: boolean;
	yieldPos: number;
	awaitPos: number;
	awaitIdentPos: number;
	preValue: any;
	preToken: any;
	isLookahead: boolean;
	isAmbientContext: boolean;
	inAbstractClass: boolean;
	inType: boolean;
	inDisallowConditionalTypesContext: boolean;
	maybeInArrowParameters: boolean;
	shouldParseArrowReturnType: any | undefined;
	shouldParseAsyncArrowReturnType: any | undefined;
	importOrExportOuterKind: string | undefined;
};

type EffectAdapterConfig = {
	acornTokenTypes: Record<string, any>;
	typeScriptTokenTypes: Record<string, any>;
	scope: {
		SCOPE_TOP: number;
		SCOPE_FUNCTION: number;
		SCOPE_CLASS_STATIC_BLOCK: number;
		BIND_LEXICAL: number;
		BIND_SIMPLE_CATCH: number;
		BIND_FUNCTION: number;
	};
};

function restoreArrayMark<T>(value: T[], length: number, description: string): T[] {
	if (value.length === length) {
		return value;
	}

	if (value.length < length) {
		throw new Error(`A parse branch shortened the ${description} below its checkpoint`);
	}

	value.length = length;
	return value;
}

function captureParserCheckpoint(parser: any): ParserCheckpoint {
	return {
		lookahead: parser.getCurLookaheadState(),
		context: parser.context,
		contextLength: parser.context.length,
		scopeStack: parser.scopeStack,
		scopeStackLength: parser.scopeStack.length,
		importsStack: parser.importsStack,
		importsStackLength: parser.importsStack.length,
		labels: parser.labels,
		labelsLength: parser.labels.length,
		privateNameStack: parser.privateNameStack,
		privateNameStackLength: parser.privateNameStack.length,
		decoratorStack: parser.decoratorStack,
		decoratorStackLength: parser.decoratorStack.length,
		strict: parser.strict,
		potentialArrowAt: parser.potentialArrowAt,
		potentialArrowInForAwait: parser.potentialArrowInForAwait,
		yieldPos: parser.yieldPos,
		awaitPos: parser.awaitPos,
		awaitIdentPos: parser.awaitIdentPos,
		preValue: parser.preValue,
		preToken: parser.preToken,
		isLookahead: parser.isLookahead,
		isAmbientContext: parser.isAmbientContext,
		inAbstractClass: parser.inAbstractClass,
		inType: parser.inType,
		inDisallowConditionalTypesContext: parser.inDisallowConditionalTypesContext,
		maybeInArrowParameters: parser.maybeInArrowParameters,
		shouldParseArrowReturnType: parser.shouldParseArrowReturnType,
		shouldParseAsyncArrowReturnType: parser.shouldParseAsyncArrowReturnType,
		importOrExportOuterKind: parser.importOrExportOuterKind
	};
}

function restoreParserCheckpoint(parser: any, state: ParserCheckpoint): void {
	parser.setLookaheadTokenState(state.lookahead);
	parser.context = restoreArrayMark(state.context, state.contextLength, 'token context stack');
	parser.scopeStack = restoreArrayMark(state.scopeStack, state.scopeStackLength, 'scope stack');
	parser.importsStack = restoreArrayMark(
		state.importsStack,
		state.importsStackLength,
		'import stack'
	);
	parser.labels = restoreArrayMark(state.labels, state.labelsLength, 'label stack');
	parser.privateNameStack = restoreArrayMark(
		state.privateNameStack,
		state.privateNameStackLength,
		'private-name stack'
	);
	parser.decoratorStack = restoreArrayMark(
		state.decoratorStack,
		state.decoratorStackLength,
		'decorator stack'
	);
	parser.strict = state.strict;
	parser.potentialArrowAt = state.potentialArrowAt;
	parser.potentialArrowInForAwait = state.potentialArrowInForAwait;
	parser.yieldPos = state.yieldPos;
	parser.awaitPos = state.awaitPos;
	parser.awaitIdentPos = state.awaitIdentPos;
	// RegExpValidationState is a reusable lexer cache. Its contents do not
	// affect the current token, and the next regexp resets it completely.
	parser.regexpState = null;
	parser.preValue = state.preValue;
	parser.preToken = state.preToken;
	parser.isLookahead = state.isLookahead;
	parser.isAmbientContext = state.isAmbientContext;
	parser.inAbstractClass = state.inAbstractClass;
	parser.inType = state.inType;
	parser.inDisallowConditionalTypesContext = state.inDisallowConditionalTypesContext;
	parser.maybeInArrowParameters = state.maybeInArrowParameters;
	parser.shouldParseArrowReturnType = state.shouldParseArrowReturnType;
	parser.shouldParseAsyncArrowReturnType = state.shouldParseAsyncArrowReturnType;
	parser.importOrExportOuterKind = state.importOrExportOuterKind;
}

function createParserStateAdapter(parser: any): ParseEffectState<ParserCheckpoint> {
	return {
		capture: () => captureParserCheckpoint(parser),
		restore: (state) => restoreParserCheckpoint(parser, state)
	};
}

/**
 * Adapts mutations performed inside Acorn and its parser mixins to ParseEffects.
 * TypeScript-owned mutations remain explicit operations at their call sites.
 */
export function adaptParser(Parser: typeof AcornParseClass, config: EffectAdapterConfig) {
	const tt = config.acornTokenTypes;
	const tsTokTypes = config.typeScriptTokenTypes;
	const scopeFlags = config.scope;
	const varScopeFlags =
		scopeFlags.SCOPE_TOP | scopeFlags.SCOPE_FUNCTION | scopeFlags.SCOPE_CLASS_STATIC_BLOCK;

	return class EffectAdapter extends Parser {
		parseEffects: ParseEffects;

		constructor(options: Options, input: string, startPos?: number) {
			super(options, input, startPos);
			this.parseEffects = new ParseEffects(this.options as any, createParserStateAdapter(this));
		}

		overrideContext(context: any) {
			if (this.curContext() !== context) {
				this.parseEffects?.willMutateTail(this.context, 1);
			}
			return super.overrideContext(context);
		}

		takeDecorators(node: any): void {
			const index = this.decoratorStack.length - 1;
			if (this.decoratorStack[index].length > 0) {
				this.parseEffects?.willSet(this.decoratorStack, String(index));
			}
			return super.takeDecorators(node);
		}

		parseDecorators(allowExport?: boolean): void {
			const decorators = this.decoratorStack[this.decoratorStack.length - 1];
			this.parseEffects?.willAppend(decorators);
			return super.parseDecorators(allowExport);
		}

		parseDecorator(): any {
			this.parseEffects?.willAppend(this.decoratorStack);
			return super.parseDecorator();
		}

		parseIdentNode() {
			const consumesKeywordContext =
				(this.type.keyword === 'class' || this.type.keyword === 'function') &&
				(this.lastTokEnd !== this.lastTokStart + 1 ||
					this.input.charCodeAt(this.lastTokStart) !== 46);
			if (consumesKeywordContext) {
				this.parseEffects?.willMutateTail(this.context, 1);
			}
			return super.parseIdentNode();
		}

		parseLabeledStatement(node, maybeName, expr, context) {
			for (let i = this.labels.length - 1; i >= 0; i--) {
				const label = this.labels[i];
				if (label.statementStart !== node.start) break;

				this.parseEffects?.willSet(label, 'statementStart');
				this.parseEffects?.willSet(label, 'kind');
			}
			this.parseEffects?.willAppend(this.labels);
			return super.parseLabeledStatement(node, maybeName, expr, context);
		}

		enterClassBody() {
			this.parseEffects?.willAppend(this.privateNameStack);
			return super.enterClassBody();
		}

		exitClassBody() {
			const parent = this.privateNameStack[this.privateNameStack.length - 2];
			if (parent) {
				this.parseEffects?.willAppend(parent.used);
			}
			this.parseEffects?.willMutateTail(this.privateNameStack, 1);
			return super.exitClassBody();
		}

		parsePrivateIdent() {
			if (this.options.checkPrivateFields && this.privateNameStack.length > 0) {
				const privateNames = this.privateNameStack[this.privateNameStack.length - 1];
				this.parseEffects?.willAppend(privateNames.used);
			}
			return super.parsePrivateIdent();
		}

		parseClassField(field) {
			this.parseEffects?.willSet(this.currentThisScope(), 'inClassFieldInit');
			return super.parseClassField(field);
		}

		updateContext(prevType) {
			const { type } = this;
			const mutatesContext =
				type === tt.parenR ||
				type === tt.braceR ||
				type === tt.braceL ||
				type === tt.dollarBraceL ||
				type === tt.parenL ||
				type === tt._function ||
				type === tt._class ||
				type === tt.colon ||
				type === tt.backQuote ||
				type === tt.star ||
				type === tsTokTypes.jsxTagStart ||
				type === tsTokTypes.jsxTagEnd ||
				(type === tt.slash && prevType === tsTokTypes.jsxTagStart);
			if (mutatesContext) {
				this.parseEffects?.willMutateTail(this.context, 2);
			}
			return super.updateContext(prevType);
		}

		enterScope(flags: any) {
			// Acorn calls this from its constructor before ParseEffects exists.
			this.parseEffects?.willAppend(this.scopeStack);
			return super.enterScope(flags);
		}

		exitScope() {
			this.parseEffects?.willMutateTail(this.scopeStack, 1);
			return super.exitScope();
		}

		declareName(name: string, bindingType: number, pos: any) {
			const effects = this.parseEffects;
			if (effects?.active) {
				if (bindingType === scopeFlags.BIND_LEXICAL) {
					const scope = this.currentScope();
					effects.willAppend(scope.lexical);
					if (this.inModule && scope.flags & scopeFlags.SCOPE_TOP) {
						effects.willSet(this.undefinedExports, name);
					}
				} else if (bindingType === scopeFlags.BIND_SIMPLE_CATCH) {
					effects.willAppend(this.currentScope().lexical);
				} else if (bindingType === scopeFlags.BIND_FUNCTION) {
					effects.willAppend(this.currentScope().functions);
				} else {
					for (let i = this.scopeStack.length - 1; i >= 0; i--) {
						const scope = this.scopeStack[i];
						effects.willAppend(scope.var);
						if (this.inModule && scope.flags & scopeFlags.SCOPE_TOP) {
							effects.willSet(this.undefinedExports, name);
						}
						if (scope.flags & varScopeFlags) break;
					}
				}
			}
			return super.declareName(name, bindingType, pos);
		}

		checkLocalExport(id) {
			this.parseEffects?.willSet(this.undefinedExports, id.name);
			return super.checkLocalExport(id);
		}
	};
}
