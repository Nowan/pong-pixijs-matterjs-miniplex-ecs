module.exports = function generatePixiAssetsManifest(seed, files, entries) {
    console.log(files);
    return {
        bundles: [
            {
                name: "core",
                assets: files.map((file) => ({
                    name: file.name,
                    srcs: file.name,
                })),
            },
        ],
    };
};
