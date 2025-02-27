
const getIdMatcher = <T extends Array<any>>(
        option:
                | undefined
                | boolean
                | string
                | RegExp
                | (string | RegExp)[]
                | ((id: string, ...parameters: T) => boolean | null | void)
): ((id: string, ...parameters: T) => boolean) => {
        if (option === true) {
                return () => true;
        }
        if (typeof option === 'function') {
                return (id, ...parameters) => (!id.startsWith('\0') && option(id, ...parameters)) || false;
        }
        if (option) {
                const ids = new Set<string>();
                const matchers: RegExp[] = [];
                for (const value of ensureArray(option)) {
                        if (value instanceof RegExp) {
                                matchers.push(value);
                        } else {
                                ids.add(value);
                        }
                }
                return (id: string, ..._arguments) => ids.has(id) || matchers.some(matcher => matcher.test(id));
        }
        return () => false;
};
