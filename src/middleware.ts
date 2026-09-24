import type { Parser, Node, TokenType, Position, tokTypes, Options } from 'acorn';

// This mostly exist to make sure that we get _some_ kind of type intellisense. It's achieved by replicating the internal acorn types
export declare class AcornParseClass extends Parser {
	static acorn?: {
		Parser: Parser;
		version: any;
		defaultOptions: any;
		Position: Position;
		SourceLocation: any;
		getLineInfo: any;
		Node: Node;
		TokenType: TokenType;
		tokTypes: typeof tokTypes;
		keywordTypes: any;
		TokContext: any;
		tokContexts: any;
		isIdentifierChar: any;
		isIdentifierStart: any;
		Token: any;
		isNewLine: any;
		lineBreak: any;
		lineBreakG: any;
		nonASCIIwhitespace: any;
	};

	options: Options & {
		onComment: any;
	};
	pos: number;
	potentialArrowAt: number;
	yieldPos: number;
	value: any;
	containsEsc: boolean;
	decoratorStack: any[];
	awaitPos: number;
	keywords: any;
	awaitIdentPos: number;
	strict: boolean;
	lastTokStart: number;
	lastTokEnd: number;
	treatFunctionsAsVar: boolean;
	allowNewDotTarget: boolean;
	inGenerator: any;
	exprAllowed: boolean;
	labels: any[];
	scopeStack: any[];
	privateNameStack: any[];
	inModule: any;
	undefinedExports: Record<string, any>;
	regexpState: any;
	lastTokEndLoc: Position;
	lastTokStartLoc: Position;
	context: any[];
	endLoc: Position;
	startLoc: Position;
	potentialArrowInForAwait: boolean;
	type: TokenType & Record<string, any>;
	start: number;
	end: number;
	curLine: number;
	lineStart: number;

	constructor(options: Options, input: string, startPos?: number);

	raise(pos: number, message: string): void;

	raiseRecoverable(pos: number, message: string): void;

	nextToken(): any;

	finishNode(node: Node, type: string): Node;

	finishNodeAt(node: Node, type: string, end: number, endLoc: Position): Node;

	parseImport(node: Node): any;

	currentScope(): any;
	currentThisScope(): any;

	treatFunctionsAsVarInScope(scope: any): boolean;

	declareName(name?: any, bindingType?: any, loc?: any): any;

	parseImportSpecifier(): any;

	parseExport(node: Node, exports: any): any;

	parseExportDeclaration(node: Node): any;

	parseExportSpecifiers(exports: any): any[];

	parseModuleExportName(): any;

	expectContextual(name: string): void;

	semicolon(): void;

	eat(type: TokenType): boolean;

	checkExport(exports: any, name: any, pos: number): void;

	unexpected(pos?: number): never;

	startNode(): any;

	startNodeAt(pos: number, loc: any): any;

	isAsyncFunction(): boolean;

	checkVariableExport(exports: any, decls: any): void;

	checkUnreserved(options: { start: number; end: number; name: string }): void;

	checkLocalExport(id: any): any;

	parseMaybeDefault(startPos?: number | null, startLoc?: any, left?: any): any;

	finishOp(type: TokenType, size: number): any;

	getTokenFromCode(code: number): TokenType;

	readToken_lt_gt(code: number): TokenType;

	fullCharCodeAtPos(): number;

	canInsertSemicolon(): boolean;

	parseFunctionParams(node: any): void;

	expect(type: TokenType): void;

	readWord1(): string;

	parseArrowExpression(node: any, param: any, isAsync?: boolean, forInit?: boolean): any;

	curContext(): any;

	updateContext(prevType: TokenType): void;

	isContextual(name: string): boolean;

	eatContextual(name: string): boolean;

	parseLiteral(value: string): any;

	checkLValSimple(expr: any, bindingType?: number, checkClashes?: any): void;

	enterScope(flags: any): void;

	exitScope(): void;

	parseFunctionStatement(node: any, isAsync?: boolean, declarationPosition?: any): any;

	parseObj(isPattern?: boolean, refDestructuringErrors?: any): any;

	parseBindingList(
		close: TokenType,
		allowEmpty?: boolean,
		allowTrailingComma?: boolean,
		allowModifiers?: boolean
	): any;

	parsePropertyName(prop: any): any;

	parsePropertyValue(
		prop: any,
		isPattern: boolean,
		isGenerator: boolean,
		isAsync: boolean,
		startPos: number,
		startLoc: Position,
		refDestructuringErrors: any,
		containsEsc: boolean
	): void;

	isLet(context?: any): boolean;

	parseTemplateElement({ isTagged }: { isTagged: boolean }): any;

	parseExpression(forInit?: boolean, refDestructuringErrors?: any): any;

	initFunction(node: any): void;

	parseFunctionBody(
		node: any,
		isArrowFunction?: boolean,
		isMethod?: boolean,
		forInit?: boolean
	): void;

	parseSubscripts(
		base: any,
		startPos: number,
		startLoc: Position,
		noCalls?: any,
		forInit?: any
	): any;

	parseSpread(refDestructuringErrors: any): any;

	parseExprList(
		close: TokenType,
		allowTrailingComma?: any,
		allowEmpty?: any,
		refDestructuringErrors?: any
	): any;

	parseExprOp(
		left: any,
		leftStartPos: number,
		leftStartLoc: Position,
		minPrec?: any,
		forInit?: any
	): any;

	buildBinary(
		startPos: number,
		startLoc: Position,
		left: any,
		right: any,
		op: string,
		logical: boolean
	): any;

	toAssignableList(exprList: any[], isBinding?: boolean): any[];

	parseMaybeUnary(
		refExpressionErrors?: any,
		sawUnary?: boolean,
		incDec?: boolean,
		forInit?: boolean
	): any;

	readRegexp(): any;

	overrideContext(ctx: any): void;

	isSimpleAssignTarget(expr: any): boolean;

	parseExprImport(forNew?: boolean): any;

	next(ignoreEscapeSequenceInKeyword?: boolean): any;

	parseStatement(context: any, topLevel?: boolean, exports?: any): any;

	parseExpressionStatement(node: any, expre: any): any;

	parseLabeledStatement(node: any, maybeName: string, expr: any, context: any): any;

	shouldParseExportStatement(): boolean;

	parseExprOps(forInit?: boolean, refDestructuringErrors?: any): any;

	checkExpressionErrors(refDestructuringErrors: any, andThrow?: boolean): boolean | undefined;

	parseParenItem(item: any): any;

	parseClassId(node: any, isStatement?: boolean | 'nullableID'): void;

	parseClassField(field: any): any;

	parseClassStaticBlock(node: any): any;

	isClassElementNameStart(): boolean;

	parseClassElementName(element: any): void;

	parseClassSuper(node: any): void;

	parseVarId(decl: any, kind: 'var' | 'let' | 'const'): void;

	parseMaybeAssign(forInit?: boolean, refDestructuringErrors?: any, afterLeftParse?: any): any;

	toAssignable(node: any, isBinding?: boolean, refDestructuringErrors?: any): any;

	curPosition(): Position;

	checkPatternErrors(refDestructuringErrors?: any, isAssign?: boolean): void;

	parseExprSubscripts(refDestructuringErrors?: any, forInit?: boolean): any;

	checkYieldAwaitInDefaultParams(): void;

	parseParenExpression(): any;

	parseBindingAtom(): any;

	afterTrailingComma(tokType: TokenType, notNext?: boolean): boolean | undefined;

	parsePrivateIdent(): any;

	parseExportSpecifier(exports: any): any;

	parseRestBinding(): any;

	parseBlock(createNewLexicalScope?: boolean, node?: any, exitStrict?: boolean): any;

	enterClassBody(): any;

	exitClassBody(): void;

	parseIdentNode(): any;

	parseVar(
		node: any,
		isFor: boolean,
		kind: 'var' | 'let' | 'const',
		allowMissingInitializer?: boolean
	): any;

	parseExportDefaultDeclaration(): any;

	parseIdent(liberal?: boolean): any;

	copyNode(node: any): any;

	checkLValPattern(expr: any, bindingType?: number, checkClashes?: any): void;

	checkLValInnerPattern(expr: any, bindingType?: number, checkClashes?: any): void;

	isAsyncProp(prop: any): boolean;

	shouldParseArrow(): boolean;

	parseYield(forInit?: any): any;

	parseProperty(isPattern?: boolean, refDestructuringErrors?: any): any;

	takeDecorators(node: any): void;

	parseDecorators(allowExport?: boolean): void;

	parseDecorator(): any;

	parseMaybeDecoratorArguments(expr: any): any;

	resetStartLocationFromNode(node: Node, locationNode: Node): void;

	match(type: TokenType): boolean;

	canHaveLeadingDecorator(): boolean;

	startNodeAtNode(type: Node): any;

	readToken(code: number): any;

	jsx_readToken(): any;

	jsx_readString(quote: any): any;

	jsx_parseText(): any;

	jsx_parseElement(): any;

	jsx_readWord(): any;

	jsx_parseElementName(): any;

	jsx_parseAttribute(): any;

	finishToken(token: TokenType, val?: string): any;

	parseExprAtom(refDestructuringErrors?: any, forInit?: boolean, forNew?: boolean): any;

	parseImportSpecifiers(): any;

	parseImportDefaultSpecifier(): any;

	parseImportNamespaceSpecifier(): any;

	parseImportAttributes(): any;

	parseMaybeImportAttributes(node: any): any;
}
