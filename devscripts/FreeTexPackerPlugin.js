const FreeTexPackerPlugin = require("webpack-free-tex-packer");
const { Compilation } = require("webpack");

class ExtendedFreeTexPackerPlugin extends FreeTexPackerPlugin {
    constructor(...configEntries) {
        super(null, null, {});

        this._configEntries = configEntries.map((rawConfigEntry) => ({
            from: Array.isArray(rawConfigEntry.from) ? rawConfigEntry.from : [rawConfigEntry.from],
            to: rawConfigEntry.to || ".",
            options: rawConfigEntry.options || {},
        }));
    }

    apply(compiler) {
        if (compiler.hooks && compiler.hooks.thisCompilation) {
            compiler.hooks.thisCompilation.tap("WebpackFreeTexPacker", this.thisCompilationHookHandler.bind(this));
        } else {
            super.apply(compiler);
        }
    }

    async thisCompilationHookHandler(compilation) {
        compilation.hooks.processAssets.tapAsync(
            {
                name: "WebpackFreeTexPacker",
                stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
            },
            (_, callback) => this.processAssetsHookHandler(compilation, callback),
        );
    }

    async processAssetsHookHandler(compilation, callback) {
        for (let configEntry of this._configEntries) {
            this.src = configEntry.from;
            this.dest = configEntry.to;
            this.options = configEntry.options;
            this.watchStarted = false;

            await new Promise((resolve) => super.emitHookHandler(compilation, resolve));

            postprocessConfigEntry(configEntry, compilation);
        }

        this.changed = false;
        this.watchStarted = true;

        callback();
    }
}

function postprocessConfigEntry(configEntry, compilation) {
    const folderPath = configEntry.to.replace(/\/$/, "");
    const atlasNamePattern = new RegExp(`${configEntry.options.textureName}(?:-\\d+)?\\..*`);
    const atlasNames = Object.keys(compilation.assets).filter((fileName) => atlasNamePattern.test(fileName));

    for (let atlasName of atlasNames) {
        if (configEntry.options.prependFolderPath && atlasName.endsWith(".json")) {
            compilation.assets[atlasName] = prependFolderPath(compilation.assets[atlasName], folderPath);
        }

        // const atlasNameWithSuffix = prependExtensionSuffix(".atlas", atlasName);
        // compilation.assets[atlasNameWithSuffix] = compilation.assets[atlasName];
        // delete compilation.assets[atlasName];
    }
}

function prependFolderPath(rawAtlasAsset, folderPath) {
    const atlasJson = JSON.parse(rawAtlasAsset.source().toString("utf-8"));

    atlasJson.frames = Object.entries(atlasJson.frames).reduce(
        (framesJson, [frameName, frameData]) => ({
            [`${folderPath}/${frameName}`]: frameData,
            ...framesJson,
        }),
        {},
    );

    const atlasBuffer = Buffer.from(JSON.stringify(atlasJson, null, 2), "utf-8");

    return {
        source: () => atlasBuffer,
        size: () => atlasBuffer.length,
    };
}

function prependExtensionSuffix(extensionSuffix, atlasName) {
    const extensionCharIndex = atlasName.lastIndexOf(".");

    return [atlasName.slice(0, extensionCharIndex), extensionSuffix, atlasName.slice(extensionCharIndex)].join("");
}

module.exports = ExtendedFreeTexPackerPlugin;
