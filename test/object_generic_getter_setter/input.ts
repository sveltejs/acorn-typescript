const a = {
	get b<T>(): T {
		return {} as T;
	},
	set b<T>(v: T) {}
};
