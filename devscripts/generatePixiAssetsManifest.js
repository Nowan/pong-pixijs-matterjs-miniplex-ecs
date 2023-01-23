const sourceManifest = require("../src/assets/manifest.json");

module.exports = function generatePixiAssetsManifest(seed, files, entries) {
    return {
        bundles: [
            {
                name: "core",
                assets: files.map((file) => ({
                    name: file.name,
                    srcs: file.name,
                })),
            },
            ...sourceManifest.bundles,
        ],
    };
};
