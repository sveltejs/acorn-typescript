function* f() {
	yield g();
	const fn = async <T>(value: T): Promise<T> => value;
}
