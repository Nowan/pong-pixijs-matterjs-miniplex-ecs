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

    emitHookHandler(compilation, callback) {
        Promise.all(
            this._configEntries.map((configEntry) => {
                this.src = configEntry.from;
                this.dest = configEntry.to;
                this.options = configEntry.options;

                return new Promise((resolve) => super.emitHookHandler(compilation, resolve));
            }),
        ).then(() => callback());
    }
}

module.exports = ExtendedFreeTexPackerPlugin;
