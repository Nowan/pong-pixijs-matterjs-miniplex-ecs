const FreeTexPackerPlugin = require("webpack-free-tex-packer");

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
        }

        this.changed = false;
        this.watchStarted = true;

        callback();
    }
}

module.exports = ExtendedFreeTexPackerPlugin;
