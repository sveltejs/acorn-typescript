import { AcornParseClass } from '../middleware.js';
import { AcornTypeScript } from '../types.js';
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

				// check if we already have an entry for an attribute
				// if a duplicate entry is found, throw an error
				// a quoted key is a Literal, so compare by its value: `type` and `'type'` are the same key
				const keyName = node.key.type === 'Literal' ? node.key.value : node.key.name;
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
