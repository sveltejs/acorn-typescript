import XHTMLEntities from './xhtml';
import type { AcornParseClass } from '../../middleware';
import type { AcornTypeScript } from '../../types';
import type * as acornNamespace from 'acorn';

const hexNumber = /^[\da-fA-F]+$/;
const decimalNumber = /^\d+$/;

// Transforms JSX element name to string.

function getQualifiedJSXName(object) {
	if (!object) return object;

	if (object.type === 'JSXIdentifier') return object.name;

	if (object.type === 'JSXNamespacedName') return object.namespace.name + ':' + object.name.name;

	if (object.type === 'JSXMemberExpression')
		return getQualifiedJSXName(object.object) + '.' + getQualifiedJSXName(object.property);
}

/**
 *
 * {
 *       allowNamespaces: options.allowNamespaces !== false,
 *       allowNamespacedObjects: !!options.allowNamespacedObjects
 *     }
 * */
export default function generateJsxParser(
	acorn: typeof acornNamespace | (typeof AcornParseClass)['acorn'],
	acornTypeScript: AcornTypeScript,
	Parser: typeof AcornParseClass,
	jsxOptions?: {
		allowNamespaces?: boolean;
		allowNamespacedObjects?: boolean;
	}
) {
	const tt = acorn.tokTypes;
	const tok = acornTypeScript.tokTypes;
	const isNewLine = acorn.isNewLine;
	const isIdentifierChar = acorn.isIdentifierChar;
	const options = Object.assign(
		{
			allowNamespaces: true,
			allowNamespacedObjects: true
		},
		jsxOptions || {}
	);

	return class JsxParser extends Parser {
		// Reads inline JSX contents token.
		jsx_readToken() {
			let out = '',
				chunkStart = this.pos;
			for (;;) {
				if (this.pos >= this.input.length) this.raise(this.start, 'Unterminated JSX contents');
				let ch = this.input.charCodeAt(this.pos);

				switch (ch) {
					case 60: // '<'
					case 123: // '{'
						if (this.pos === this.start) {
							if (ch === 60 && this.exprAllowed) {
								++this.pos;
								return this.finishToken(tok.jsxTagStart);
							}
							return this.getTokenFromCode(ch);
						}
						out += this.input.slice(chunkStart, this.pos);
						return this.finishToken(tok.jsxText, out);

					case 38: // '&'
						out += this.input.slice(chunkStart, this.pos);
						out += this.jsx_readEntity();
						chunkStart = this.pos;
						break;

					case 62: // '>'
					case 125: // '}'
						this.raise(
							this.pos,
							'Unexpected token `' +
								this.input[this.pos] +
								'`. Did you mean `' +
								(ch === 62 ? '&gt;' : '&rbrace;') +
								'` or ' +
								'`{"' +
								this.input[this.pos] +
								'"}' +
								'`?'
						);

					default:
						if (isNewLine(ch)) {
							out += this.input.slice(chunkStart, this.pos);
							out += this.jsx_readNewLine(true);
							chunkStart = this.pos;
						} else {
							++this.pos;
						}
				}
			}
		}

		jsx_readNewLine(normalizeCRLF) {
			let ch = this.input.charCodeAt(this.pos);
			let out;
			++this.pos;
			if (ch === 13 && this.input.charCodeAt(this.pos) === 10) {
				++this.pos;
				out = normalizeCRLF ? '\n' : '\r\n';
			} else {
				out = String.fromCharCode(ch);
			}
			if (this.options.locations) {
				++this.curLine;
				this.lineStart = this.pos;
			}

			return out;
		}

		jsx_readString(quote) {
			let out = '',
				chunkStart = ++this.pos;
			for (;;) {
				if (this.pos >= this.input.length) this.raise(this.start, 'Unterminated string constant');
				let ch = this.input.charCodeAt(this.pos);
				if (ch === quote) break;
				if (ch === 38) {
					// '&'
					out += this.input.slice(chunkStart, this.pos);
					out += this.jsx_readEntity();
					chunkStart = this.pos;
				} else if (isNewLine(ch)) {
					out += this.input.slice(chunkStart, this.pos);
					out += this.jsx_readNewLine(false);
					chunkStart = this.pos;
				} else {
					++this.pos;
				}
			}
			out += this.input.slice(chunkStart, this.pos++);
			return this.finishToken(tt.string, out);
		}

		jsx_readEntity() {
			let str = '',
				count = 0,
				entity;
			let ch = this.input[this.pos];
			if (ch !== '&') this.raise(this.pos, 'Entity must start with an ampersand');
			let startPos = ++this.pos;
			while (this.pos < this.input.length && count++ < 10) {
				ch = this.input[this.pos++];
				if (ch === ';') {
					if (str[0] === '#') {
						if (str[1] === 'x') {
							str = str.substr(2);
							if (hexNumber.test(str)) entity = String.fromCharCode(parseInt(str, 16));
						} else {
							str = str.substr(1);
							if (decimalNumber.test(str)) entity = String.fromCharCode(parseInt(str, 10));
						}
					} else {
						entity = XHTMLEntities[str];
					}
					break;
				}
				str += ch;
			}
			if (!entity) {
				this.pos = startPos;
				return '&';
			}
			return entity;
		}

		// Read a JSX identifier (valid tag or attribute name).
		//
		// Optimized version since JSX identifiers can't contain
		// escape characters and so can be read as single slice.
		// Also assumes that first character was already checked
		// by isIdentifierStart in readToken.

		jsx_readWord() {
			let ch,
				start = this.pos;
			do {
				ch = this.input.charCodeAt(++this.pos);
			} while (isIdentifierChar(ch) || ch === 45); // '-'
			return this.finishToken(tok.jsxName, this.input.slice(start, this.pos));
		}

		// Parse next token as JSX identifier

		jsx_parseIdentifier() {
			let node = this.startNode();
			if (this.type === tok.jsxName) node.name = this.value;
			else if (this.type.keyword) node.name = this.type.keyword;
			else this.unexpected();
			this.next();
			return this.finishNode(node, 'JSXIdentifier');
		}

		// Parse namespaced identifier.

		jsx_parseNamespacedName() {
			let startPos = this.start,
				startLoc = this.startLoc;
			let name = this.jsx_parseIdentifier();
			if (!options.allowNamespaces || !this.eat(tt.colon)) return name;
			var node = this.startNodeAt(startPos, startLoc);
			node.namespace = name;
			node.name = this.jsx_parseIdentifier();
			return this.finishNode(node, 'JSXNamespacedName');
		}

		// Parses element name in any form - namespaced, member
		// or single identifier.

		jsx_parseElementName() {
			if (this.type === tok.jsxTagEnd) return '';
			let startPos = this.start,
				startLoc = this.startLoc;
			let node = this.jsx_parseNamespacedName();
			if (
				this.type === tt.dot &&
				node.type === 'JSXNamespacedName' &&
				!options.allowNamespacedObjects
			) {
				this.unexpected();
			}
			while (this.eat(tt.dot)) {
				let newNode = this.startNodeAt(startPos, startLoc);
				newNode.object = node;
				newNode.property = this.jsx_parseIdentifier();
				node = this.finishNode(newNode, 'JSXMemberExpression');
			}
			return node;
		}

		// Parses any type of JSX attribute value.

		jsx_parseAttributeValue() {
			switch (this.type) {
				case tt.braceL:
					let node = this.jsx_parseExpressionContainer();
					if (node.expression.type === 'JSXEmptyExpression')
						this.raise(node.start, 'JSX attributes must only be assigned a non-empty expression');
					return node;

				case tok.jsxTagStart:
				case tt.string:
					return this.parseExprAtom();

				default:
					this.raise(this.start, 'JSX value should be either an expression or a quoted JSX text');
			}
		}

		// JSXEmptyExpression is unique type since it doesn't actually parse anything,
		// and so it should start at the end of last read token (left brace) and finish
		// at the beginning of the next one (right brace).

		jsx_parseEmptyExpression() {
			let node = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc);
			return this.finishNodeAt(node, 'JSXEmptyExpression', this.start, this.startLoc);
		}

		// Parses JSX expression enclosed into curly brackets.

		jsx_parseExpressionContainer(): any {
			let node = this.startNode();
			this.next();
			node.expression =
				this.type === tt.braceR ? this.jsx_parseEmptyExpression() : this.parseExpression();
			this.expect(tt.braceR);
			return this.finishNode(node, 'JSXExpressionContainer');
		}

		// Parses following JSX attribute name-value pair.

		jsx_parseAttribute() {
			let node = this.startNode();
			if (this.eat(tt.braceL)) {
				this.expect(tt.ellipsis);
				node.argument = this.parseMaybeAssign();
				this.expect(tt.braceR);
				return this.finishNode(node, 'JSXSpreadAttribute');
			}
			node.name = this.jsx_parseNamespacedName();
			node.value = this.eat(tt.eq) ? this.jsx_parseAttributeValue() : null;
			return this.finishNode(node, 'JSXAttribute');
		}

		// Parses JSX opening tag starting after '<'.

		jsx_parseOpeningElementAt(startPos, startLoc): any {
			let node = this.startNodeAt(startPos, startLoc);
			node.attributes = [];
			let nodeName = this.jsx_parseElementName();
			if (nodeName) node.name = nodeName;
			while (this.type !== tt.slash && this.type !== tok.jsxTagEnd)
				node.attributes.push(this.jsx_parseAttribute());
			node.selfClosing = this.eat(tt.slash);
			this.expect(tok.jsxTagEnd);
			return this.finishNode(node, nodeName ? 'JSXOpeningElement' : 'JSXOpeningFragment');
		}

		// Parses JSX closing tag starting after '</'.

		jsx_parseClosingElementAt(startPos, startLoc) {
			let node = this.startNodeAt(startPos, startLoc);
			let nodeName = this.jsx_parseElementName();
			if (nodeName) node.name = nodeName;
			this.expect(tok.jsxTagEnd);
			return this.finishNode(node, nodeName ? 'JSXClosingElement' : 'JSXClosingFragment');
		}

		// Parses entire JSX element, including it's opening tag
		// (starting after '<'), attributes, contents and closing tag.

		jsx_parseElementAt(startPos, startLoc) {
			let node = this.startNodeAt(startPos, startLoc);
			let children = [];
			let openingElement = this.jsx_parseOpeningElementAt(startPos, startLoc);
			let closingElement = null;

			if (!openingElement.selfClosing) {
				contents: for (;;) {
					switch (this.type) {
						case tok.jsxTagStart:
							startPos = this.start;
							startLoc = this.startLoc;
							this.next();
							if (this.eat(tt.slash)) {
								closingElement = this.jsx_parseClosingElementAt(startPos, startLoc);
								break contents;
							}
							children.push(this.jsx_parseElementAt(startPos, startLoc));
							break;

						case tok.jsxText:
							children.push(this.parseExprAtom());
							break;

						case tt.braceL:
							children.push(this.jsx_parseExpressionContainer());
							break;

						default:
							this.unexpected();
					}
				}
				if (getQualifiedJSXName(closingElement.name) !== getQualifiedJSXName(openingElement.name)) {
					this.raise(
						closingElement.start,
						'Expected corresponding JSX closing tag for <' +
							getQualifiedJSXName(openingElement.name) +
							'>'
					);
				}
			}
			let fragmentOrElement = openingElement.name ? 'Element' : 'Fragment';

			node['opening' + fragmentOrElement] = openingElement;
			node['closing' + fragmentOrElement] = closingElement;
			node.children = children;
			if (this.type === tt.relational && this.value === '<') {
				this.raise(this.start, 'Adjacent JSX elements must be wrapped in an enclosing tag');
			}
			return this.finishNode(node, 'JSX' + fragmentOrElement);
		}

		// Parse JSX text

		jsx_parseText() {
			let node = this.parseLiteral(this.value);
			node.type = 'JSXText';
			return node;
		}

		// Parses entire JSX element from current position.

		jsx_parseElement() {
			let startPos = this.start,
				startLoc = this.startLoc;
			this.next();
			return this.jsx_parseElementAt(startPos, startLoc);
		}
	};
}
