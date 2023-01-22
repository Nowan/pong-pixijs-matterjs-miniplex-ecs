const FreeTexPackerPlugin = require("webpack-free-tex-packer");
const { readdirSync } = require("fs");
class ExtendedFreeTexPackerPlugin extends FreeTexPackerPlugin {
    constructor(...configEntries) {
        super(null, null, {});

        this._configEntries = configEntries.map((rawConfigEntry) => ({
            from: Array.isArray(rawConfigEntry.from) ? rawConfigEntry.from : [rawConfigEntry.from],
            to: rawConfigEntry.to || ".",
            options: rawConfigEntry.options || {},
        }));
    }

    async emitHookHandler(compilation, callback) {
        for (let configEntry of this._configEntries) {
            this.src = configEntry.from;
            this.dest = configEntry.to;
            this.options = configEntry.options;
            this.watchStarted = false;

            await new Promise((resolve) => super.emitHookHandler(compilation, resolve));

            if (configEntry.options.prependFolderPath) {
                postprocessPrependFolderPath(configEntry, compilation);
            }
        }

        this.changed = false;
        this.watchStarted = true;

        callback();
    }
}

function postprocessPrependFolderPath(configEntry, compilation) {
    const folderPath = configEntry.to.replace(/\/$/, "");
    const atlasNamePattern = new RegExp(`${configEntry.options.textureName}(?:-\\d+)?\\.json$`);
    const atlasNames = Object.keys(compilation.assets).filter((fileName) => atlasNamePattern.test(fileName));

    for (let atlasName of atlasNames) {
        const rawAsset = compilation.assets[atlasName];
        const atlasJson = JSON.parse(rawAsset.source().toString("utf-8"));

        atlasJson.frames = Object.entries(atlasJson.frames).reduce(
            (framesJson, [frameName, frameData]) => ({
                [`${folderPath}/${frameName}`]: frameData,
                ...framesJson,
            }),
            {},
        );

        const atlasBuffer = Buffer.from(JSON.stringify(atlasJson, null, 2), "utf-8");

        compilation.assets[atlasName] = {
            source() {
                return atlasBuffer;
            },
            size() {
                return atlasBuffer.length;
            },
        };
    }
}

module.exports = ExtendedFreeTexPackerPlugin;
