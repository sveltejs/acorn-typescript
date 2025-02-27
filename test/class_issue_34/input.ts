
export default class Graph {
        readonly acornParser: typeof acorn.Parser;
        readonly cachedModules = new Map<string, ModuleJSON>();
        readonly deoptimizationTracker = new PathTracker();
        entryModules: Module[] = [];
        readonly fileOperationQueue: Queue;
        readonly moduleLoader: ModuleLoader;
        readonly modulesById = new Map<string, Module | ExternalModule>();
        needsTreeshakingPass = false;
        phase: BuildPhase = BuildPhase.LOAD_AND_PARSE;
        readonly pluginDriver: PluginDriver;
        readonly pureFunctions: PureFunctions;
        readonly scope = new GlobalScope();
        readonly watchFiles: Record<string, true> = Object.create(null);
        watchMode = false;

        private readonly externalModules: ExternalModule[] = [];
        private implicitEntryModules: Module[] = [];
        private modules: Module[] = [];
        private declare pluginCache?: Record<string, SerializablePluginCache>;
}
