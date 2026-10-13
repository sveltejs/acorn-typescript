async function f() {
	await g();
	const fn = async <T>(value: T): Promise<T> => value;
}
