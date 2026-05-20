import type { TokenType } from 'acorn';
import type { AcornTypeScript } from './types';
import type { AcornParseClass } from './middleware';

const startsExpr = true;
const acornTypeScriptMap = new WeakMap();

export function generateAcornTypeScript(_acorn: any): AcornTypeScript {
	// Do NOT use any value imports from 'acorn' here, as the passed version might be different to ours
	const acorn: (typeof AcornParseClass)['acorn'] = _acorn.Parser.acorn || _acorn;
	let acornTypeScript = acornTypeScriptMap.get(acorn);

	if (!acornTypeScript) {
		const { tokTypes, keywordTypes } = acorn;
		const keywordTypeValues = Object.values(keywordTypes);
		const tsKwTokenType = generateTsKwTokenType();
		const tsKwTokenTypeValues = Object.values(tsKwTokenType);
		const tsTokenType = generateTsTokenType();
		const tsTokenContext = generateTsTokenContext();
		const tsKeywordsRegExp = new RegExp(`^(?:${Object.keys(tsKwTokenType).join('|')})$`);

		(tsTokenType.jsxTagStart as any).updateContext = function () {
			this.context.push(tsTokenContext.tc_expr); // treat as beginning of
			// JSX expression
			this.context.push(tsTokenContext.tc_oTag); // start opening tag context
			this.exprAllowed = false;
		};

		(tsTokenType.jsxTagEnd as any).updateContext = function (prevType) {
			let out = this.context.pop();
			if (
				(out === tsTokenContext.tc_oTag && prevType === tokTypes.slash) ||
				out === tsTokenContext.tc_cTag
			) {
				this.context.pop();
				this.exprAllowed = this.curContext() === tsTokenContext.tc_expr;
			} else {
				this.exprAllowed = true;
			}
		};

		function tokenIsLiteralPropertyName(token: TokenType): boolean {
			return (
				token === tokTypes.name ||
				token === tokTypes.string ||
				token === tokTypes.num ||
				keywordTypeValues.includes(token) ||
				tsKwTokenTypeValues.includes(token)
			);
		}

		function tokenIsKeywordOrIdentifier(token: TokenType): boolean {
			return (
				token === tokTypes.name ||
				keywordTypeValues.includes(token) ||
				tsKwTokenTypeValues.includes(token)
			);
		}

		function tokenIsIdentifier(token: TokenType): boolean {
			return token === tokTypes.name || tsKwTokenTypeValues.includes(token);
		}

		function tokenIsTSDeclarationStart(token: TokenType): boolean {
			return (
				token === tsKwTokenType.abstract ||
				token === tsKwTokenType.declare ||
				token === tsKwTokenType.enum ||
				token === tsKwTokenType.module ||
				token === tsKwTokenType.namespace ||
				token === tsKwTokenType.interface ||
				token === tsKwTokenType.type
			);
		}

		function tokenIsTSTypeOperator(token: TokenType): boolean {
			return (
				token === tsKwTokenType.keyof ||
				token === tsKwTokenType.readonly ||
				token === tsKwTokenType.unique
			);
		}

		function tokenIsTemplate(token: TokenType): boolean {
			return token === tokTypes.invalidTemplate;
		}

		acornTypeScript = {
			tokTypes: {
				...tsKwTokenType,
				...tsTokenType
			},
			tokContexts: {
				...tsTokenContext
			},
			keywordsRegExp: tsKeywordsRegExp,
			tokenIsLiteralPropertyName,
			tokenIsKeywordOrIdentifier,
			tokenIsIdentifier,
			tokenIsTSDeclarationStart,
			tokenIsTSTypeOperator,
			tokenIsTemplate
		};
	}

	return acornTypeScript;

	// Succinct definitions of keyword token types

	function kwLike(_name, options: any = {}) {
		// @ts-expect-error
		return new acorn.TokenType('name', options);
	}

	function generateTsTokenContext() {
		return {
			tc_oTag: new acorn.TokContext('<tag', false, false),
			tc_cTag: new acorn.TokContext('</tag', false, false),
			tc_expr: new acorn.TokContext('<tag>...</tag>', true, true)
		};
	}

	function generateTsTokenType() {
		return {
			// @ts-expect-error
			at: new acorn.TokenType('@'),
			// @ts-expect-error
			jsxName: new acorn.TokenType('jsxName'),
			// @ts-expect-error
			jsxText: new acorn.TokenType('jsxText', { beforeExpr: true }),
			// @ts-expect-error
			jsxTagStart: new acorn.TokenType('jsxTagStart', { startsExpr: true }),
			// @ts-expect-error
			jsxTagEnd: new acorn.TokenType('jsxTagEnd')
		};
	}

	function generateTsKwTokenType() {
		return {
			assert: kwLike('assert', { startsExpr }),
			asserts: kwLike('asserts', { startsExpr }),
			global: kwLike('global', { startsExpr }),
			keyof: kwLike('keyof', { startsExpr }),
			readonly: kwLike('readonly', { startsExpr }),
			unique: kwLike('unique', { startsExpr }),
			abstract: kwLike('abstract', { startsExpr }),
			declare: kwLike('declare', { startsExpr }),
			enum: kwLike('enum', { startsExpr }),
			module: kwLike('module', { startsExpr }),
			namespace: kwLike('namespace', { startsExpr }),
			interface: kwLike('interface', { startsExpr }),
			type: kwLike('type', { startsExpr })
		};
	}
}
