import { AcornParseClass } from '../middleware';
import { AcornTypeScript } from '../types';
import type * as acornNamespace from 'acorn';

export default function generateParseImportAssertions(
	Parse: typeof AcornParseClass,
	acornTypeScript: AcornTypeScript,
	acorn: typeof acornNamespace | (typeof AcornParseClass)['acorn']
) {
	const { tokTypes } = acornTypeScript;
	const { tokTypes: tt } = acorn;
	return class ImportAttributes extends Parse {
		parseMaybeImportAttributes(node) {
			// import assertions
			if (this.type === tt._with || this.type === tokTypes.assert) {
				this.next();
				const attributes = this.parseImportAttributes();
				if (attributes) {
					node.attributes = attributes;
				}
			}
		}

		parseImportAttributes() {
			this.expect(tt.braceL);
			const attrs = this.parseWithEntries();
			this.expect(tt.braceR);
			return attrs;
		}

		parseWithEntries() {
			const attrs = [];
			const attrNames = new Set();

			do {
				if (this.type === tt.braceR) {
					break;
				}

				const node = this.startNode();

				// parse withionKey : IdentifierName, StringLiteral
				let withionKeyNode;
				if (this.type === tt.string) {
					withionKeyNode = this.parseLiteral(this.value);
				} else {
					withionKeyNode = this.parseIdent(true);
				}
				this.next();
				node.key = withionKeyNode;

				// Check for a duplicate attribute key. The key may be written either as an
				// identifier or as a string, and the two spellings collide: `type` and
				// `'typ\u0065'` are the same key. Only an identifier carries `name`, so
				// comparing that alone missed every duplicate involving a string.
				const keyName = node.key.type === 'Identifier' ? node.key.name : node.key.value;
				if (attrNames.has(keyName)) {
					this.raise(this.pos, 'Duplicated key in attributes');
				}
				attrNames.add(keyName);

				if (this.type !== tt.string) {
					this.raise(this.pos, 'Only string is supported as an attribute value');
				}

				node.value = this.parseLiteral(this.value);

				attrs.push(this.finishNode(node, 'ImportAttribute'));
			} while (this.eat(tt.comma));

			return attrs;
		}
	};
}
