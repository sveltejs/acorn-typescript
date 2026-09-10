import { DecoratorsError } from '../error';
import type { AcornParseClass } from '../middleware';
import type { AcornTypeScript } from '../types';
import type * as acornNamespace from 'acorn';

export default function generateParseDecorators(
	Parse: typeof AcornParseClass,
	acornTypeScript: AcornTypeScript,
	acorn: typeof acornNamespace | (typeof AcornParseClass)['acorn']
) {
	const { tokTypes: tt } = acorn;
	const { tokTypes } = acornTypeScript;
	return class ParseDecorators extends Parse {
		takeDecorators(node: any): void {
			const decorators = this.decoratorStack[this.decoratorStack.length - 1];
			if (decorators.length) {
				node.decorators = decorators;
				this.resetStartLocationFromNode(node, decorators[0]);
				this.decoratorStack[this.decoratorStack.length - 1] = [];
			}
		}

		parseDecorators(allowExport?: boolean): void {
			const currentContextDecorators = this.decoratorStack[this.decoratorStack.length - 1];
			while (this.match(tokTypes.at)) {
				const decorator = this.parseDecorator();
				currentContextDecorators.push(decorator);
			}

			if (this.match(tt._export)) {
				if (!allowExport) {
					this.unexpected();
				}
			} else if (!this.canHaveLeadingDecorator()) {
				this.raise(this.start, DecoratorsError.UnexpectedLeadingDecorator);
			}
		}

		parseDecorator(): any {
			const node = this.startNode();
			this.next();

			// Every time a decorator class expression is evaluated, a new empty array is pushed onto the stack
			// So that the decorators of any nested class expressions will be dealt with separately
			this.decoratorStack.push([]);

			const startPos = this.start;
			const startLoc = this.startLoc;
			let expr: any;

			if (this.match(tt.parenL)) {
				const startPos = this.start;
				const startLoc = this.startLoc;
				this.next(); // eat '('
				expr = this.parseExpression();
				this.expect(tt.parenR);

				if (this.options.preserveParens) {
					let par = this.startNodeAt(startPos, startLoc);
					par.expression = expr;
					expr = this.finishNode(par, 'ParenthesizedExpression');
				}
			} else {
				expr = this.parseIdent(false);
			}

			// A parenthesized expression is itself a DecoratorMemberExpression, so a member
			// chain may follow either form: `@(foo).bar` as much as `@foo.bar`. Running this
			// before the arguments below is what keeps `@foo().bar` rejected, since the
			// grammar does not let a DecoratorCallExpression be extended.
			while (this.eat(tt.dot)) {
				const node = this.startNodeAt(startPos, startLoc);
				node.object = expr;
				// A decorator may also name a private class member, as in `@A.#dec`.
				node.property =
					this.type === tt.privateId ? this.parsePrivateIdent() : this.parseIdent(true);
				node.computed = false;
				expr = this.finishNode(node, 'MemberExpression');
			}

			node.expression = this.parseMaybeDecoratorArguments(expr);
			this.decoratorStack.pop();

			return this.finishNode(node, 'Decorator');
		}

		parseMaybeDecoratorArguments(expr: any): any {
			if (this.eat(tt.parenL)) {
				const node = this.startNodeAtNode(expr);
				node.callee = expr;
				node.arguments = this.parseExprList(tt.parenR, false);
				return this.finishNode(node, 'CallExpression');
			}

			return expr;
		}
	};
}
