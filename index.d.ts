import { Parser } from 'acorn';

declare function tsPlugin(options?: {
	dts?: boolean;
	allowSatisfies?: boolean;
	/** Whether to use JSX. Defaults to false */
	jsx?:
		| boolean
		| {
				allowNamespaces?: boolean;
				allowNamespacedObjects?: boolean;
		  };
}): (BaseParser: typeof Parser) => typeof Parser;

export { tsPlugin, tsPlugin as default };
