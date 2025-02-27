
export default class Bundle {
    private readonly facadeChunkByModule = new Map<Module, Chunk>();
    private readonly includedNamespaces = new Set<Module>();

    constructor(
        private readonly outputOptions: NormalizedOutputOptions,
        private readonly unsetOptions: ReadonlySet<string>,
        private readonly inputOptions: NormalizedInputOptions,
        private readonly pluginDriver: PluginDriver,
        private readonly graph: Graph
    ) {}
 }
