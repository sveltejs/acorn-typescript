import { describe, it } from 'vitest';
import { equalNode, generateSource, parseSource } from '../utils';
import ArrowFunctionTypeSnapshot from '../__snapshot__/arrow-function/type';

const issue38File = `
let defaultHashSize = 0
export const getHashPlaceholderGenerator = (): any => {
  let nextIndex = 0;
  return (optionName: string, hashSize: number = defaultHashSize) => {}
}
`;

const issue39File = `export const getPureFunctions = ({ treeshake }: NormalizedInputOptions): PureFunctions => {};`;

describe('arrow-function type test', () => {
	it('assignment pattern', () => {
		const node = parseSource(generateSource([`(x = 42): void => {}`]));

		equalNode(node, ArrowFunctionTypeSnapshot.AssignmentPattern);
	});

	it('issue 32', () => {
		const node = parseSource(
			generateSource([`const testApp = async(app: string, index: number) => {`, `};`])
		);

		equalNode(node, ArrowFunctionTypeSnapshot.Issue32);
	});

	it('issue 38', () => {
		const node = parseSource(issue38File);

		equalNode(node, ArrowFunctionTypeSnapshot.Issue38);
	});

	it('issue 39', () => {
		const node = parseSource(issue39File);

		equalNode(node, ArrowFunctionTypeSnapshot.Issue39);
	});

	it('simple generic', () => {
		const node = parseSource(generateSource([`const test = <T>(a: T): T => {`, `  return a`, `}`]));

		equalNode(node, ArrowFunctionTypeSnapshot.SimpleGeneric);
	});

	it('generic with extends', () => {
		const node = parseSource(
			generateSource([`const test = <T extends string>(a: T): T => {`, `  return a`, `}`])
		);

		equalNode(node, ArrowFunctionTypeSnapshot.GenericWithExtends);
	});

	it('generic with const', () => {
		const node = parseSource(
			generateSource([`const test = <const T>(a: T): T => {`, `  return a`, `}`])
		);

		equalNode(node, ArrowFunctionTypeSnapshot.GenericWithConst);
	});

	it('rest parameter', () => {
		const node = parseSource(generateSource(['const f = (...args: any) => {}']));

		equalNode(node, ArrowFunctionTypeSnapshot.RestParameter);
	});

	it('async + rest parameter', () => {
		const node = parseSource(generateSource(['const f = async (...args: any) => {}']));

		equalNode(node, ArrowFunctionTypeSnapshot.AsyncRestParameter);
	});

	it('destructuring + default value', () => {
		const node = parseSource(
			generateSource([
				`const increment = ({ increment } : { increment?: number } = {}) => {`,
				` count += 1`,
				`}`
			])
		);

		equalNode(node, ArrowFunctionTypeSnapshot.DestructuringDefaultValue);
	});
});
