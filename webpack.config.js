/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const merge = require("webpack-merge").merge;
const { readdirSync } = require("fs");

// plugins
const HtmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FreeTexPackerPlugin = require("./devscripts/FreeTexPackerPlugin");
const { WebpackManifestPlugin: ManifestPlugin } = require("webpack-manifest-plugin");
const { ProvidePlugin } = require("webpack");
const generatePixiAssetsManifest = require("./devscripts/generatePixiAssetsManifest");

// Looks up subdirectories under path and creates separate configurations for each one
// Textures in each one are packed in a separate atlas named after subdirectory
const rawTexturesPath = "src/assets/textures/";
const packerOutputPath = "assets/textures";
const packerEntries = readdirSync(rawTexturesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => ({
        from: rawTexturesPath + dirent.name,
        to: packerOutputPath,
        options: {
            textureName: `${dirent.name}`,
            fixedSize: false,
            padding: 2,
            allowRotation: true,
            detectIdentical: true,
            allowTrim: true,
            exporter: "Pixi",
            removeFileExtension: false,
            prependFolderName: true,
            prependFolderPath: true,
        },
    }));

module.exports = (env) => {
    const config = {
        entry: "./src/index.tsx",

        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },

        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        "css-loader",
                    ],
                },
            ],
        },
        optimization: {
            splitChunks: {
                chunks: "all",
            },
        },

        plugins: [
            new HtmlPlugin({
                template: "src/index.html",
            }),
            new ProvidePlugin({
                React: "react",
            }),
            new FreeTexPackerPlugin(...packerEntries),
            new CopyPlugin({
                patterns: [{ from: "textures/*.*", to: "assets", context: "src/assets/", noErrorOnMissing: true }],
            }),
            new ManifestPlugin({
                fileName: "assets/manifest.json",
                writeToFileEmit: true,
                generate: generatePixiAssetsManifest,
                filter: (file) => file.name.includes("assets/textures/"),
            }),
        ],
    };
    const envConfig = require(path.resolve(__dirname, `./webpack.${env.mode}.js`))(env);

    const mergedConfig = merge(config, envConfig);

    return mergedConfig;
};
