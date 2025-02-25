import { describe, it, expect } from 'vitest';
import {
	equalNode,
	generateSource,
	parseDtsSource,
	parseSource,
	parseSourceShouldThrowError
} from '../utils';
import ExportTypeSnapshot from '../__snapshot__/export/type';
import { TypeScriptError } from '../../src/error';

describe('export type', () => {
	it('export type', () => {
		const node = parseSource(generateSource([`export type Test = string | number`]));

		equalNode(node, ExportTypeSnapshot.Type);
	});

	it('export serious type', () => {
		const node = parseSource(
			generateSource([
				`type Name = string`,
				`type Age = number`,
				`export {`,
				`  Name,`,
				`  Age`,
				`}`
			])
		);

		equalNode(node, ExportTypeSnapshot.SeriousType);
	});

	it('export type and const', () => {
		const node = parseSource(
			generateSource([`const a = 1`, `type A = number`, `export {`, `  a,`, `  type A`, `}`])
		);

		equalNode(node, ExportTypeSnapshot.ExportTypeAndConst);
	});

	it('export type with as and const', () => {
		const node = parseSource(
			generateSource([`const a = 1`, `type A = number`, `export {`, `  a,`, `  type A as B`, `}`])
		);

		equalNode(node, ExportTypeSnapshot.ExportTypeWithAsAndConst);
	});

	it('export type type with as', () => {
		const node = parseSource(
			generateSource([
				`const a = 1`,
				`type type = number`,
				`export {`,
				`  a,`,
				`  type type as A`,
				`}`
			])
		);

		equalNode(node, ExportTypeSnapshot.ExportTypeTypeWithAs);
	});

	it('export type type with as as', () => {
		const node = parseSource(
			generateSource([
				`const a = 1`,
				`type type = number`,
				`export {`,
				`  a,`,
				`  type type as as`,
				`}`
			])
		);

		equalNode(node, ExportTypeSnapshot.ExportTypeTypeWithAsAs);
	});

	it('export type as as with name', () => {
		const node = parseSource(
			generateSource([`const as = 'test'`, `export {`, `  type as as someName`, `}`])
		);

		equalNode(node, ExportTypeSnapshot.ExportTypeAsAsWithName);
	});

	it('dts export duplicate', () => {
		const node = parseDtsSource(
			generateSource([
				`export function defineConfig(options: RollupOptions): RollupOptions;`,
				`export function defineConfig(options: RollupOptions[]): RollupOptions[];`
			])
		);

		equalNode(node, ExportTypeSnapshot.DtsExportDuplicate);
	});

	it('export outer type type with name', () => {
		const res = parseSourceShouldThrowError(
			generateSource([`const A = 'test'`, `export type {`, `  type A`, `}`]),
			TypeScriptError.TypeModifierIsUsedInTypeExports,
			'(3:2)'
		);

		expect(res).toBe(true);
	});
});
