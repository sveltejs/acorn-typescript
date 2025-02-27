
export class PluginDriver {
        public readonly emitFile: EmitFile;
        public finaliseAssets: () => void;
        public getFileName: (fileReferenceId: string) => string;
        public readonly setChunkInformation: (facadeChunkByModule: ReadonlyMap<Module, Chunk>) => void;
        public readonly setOutputBundle: (
                bundle: OutputBundleWithPlaceholders,
                outputOptions: NormalizedOutputOptions
        ) => void;

        private readonly fileEmitter: FileEmitter;
        private readonly pluginContexts: ReadonlyMap<Plugin, PluginContext>;
        private readonly plugins: readonly Plugin[];
        private readonly sortedPlugins = new Map<AsyncPluginHooks, Plugin[]>();
        private readonly unfulfilledActions = new Set<HookAction>();

        hookFirst<H extends AsyncPluginHooks & FirstPluginHooks>(
                hookName: H,
                parameters: Parameters<FunctionPluginHooks[H]>,
                replaceContext?: ReplaceContext | null,
                skipped?: ReadonlySet<Plugin> | null
        ): Promise<ReturnType<FunctionPluginHooks[H]> | null> {
                let promise: Promise<ReturnType<FunctionPluginHooks[H]> | null> = Promise.resolve(null);
                for (const plugin of this.getSortedPlugins(hookName)) {
                        if (skipped && skipped.has(plugin)) continue;
                        promise = promise.then(result => {
                                if (result != null) return result;
                                return this.runHook(hookName, parameters, plugin, replaceContext);
                        });
                }
                return promise;
        }
}
