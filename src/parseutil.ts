export class DestructuringErrors {
	public shorthandAssign: number;
	public trailingComma: number;
	public parenthesizedAssign: number;
	public parenthesizedBind: number;
	public doubleProto: number;

	constructor() {
		this.shorthandAssign =
			this.trailingComma =
			this.parenthesizedAssign =
			this.parenthesizedBind =
			this.doubleProto =
				-1;
	}
}

export function resolvePrivateNameConflict(
	current: string | undefined,
	element
): readonly [conflicted: boolean, next: string] {
	let next = 'true';
	if (element.type === 'MethodDefinition' && (element.kind === 'get' || element.kind === 'set')) {
		next = (element.static ? 's' : 'i') + element.kind;
	}

	// `class { get #a(){}; static set #a(_){} }` is also conflict.
	if (
		(current === 'iget' && next === 'iset') ||
		(current === 'iset' && next === 'iget') ||
		(current === 'sget' && next === 'sset') ||
		(current === 'sset' && next === 'sget')
	) {
		return [false, 'true'];
	}

	if (!current) return [false, next];
	return [true, current];
}

export function checkKeyName(node, name) {
	const { computed, key } = node;
	return (
		!computed &&
		((key.type === 'Identifier' && key.name === name) ||
			(key.type === 'Literal' && key.value === name))
	);
}
