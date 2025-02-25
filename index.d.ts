import { Parser } from 'acorn';

declare function tsPlugin(options?: {
	dts?: boolean;
	allowSatisfies?: boolean;
	jsx?: {
		allowNamespaces?: boolean;
		allowNamespacedObjects?: boolean;
	};
}): (BaseParser: typeof Parser) => typeof Parser;

export { tsPlugin, tsPlugin as default };
