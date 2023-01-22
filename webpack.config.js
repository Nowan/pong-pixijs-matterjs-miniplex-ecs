/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const merge = require("webpack-merge").merge;
const { readdirSync, Dirent } = require("fs");

// plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FreeTexPackerPlugin = require("./devscripts/FreeTexPackerPlugin");

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
        entry: "./src/index.ts",

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
            new HtmlWebpackPlugin({
                template: "src/index.html",
            }),
            new FreeTexPackerPlugin(...packerEntries),
            new CopyPlugin({
                patterns: [{ from: "textures/*.*", to: "assets", context: "src/assets/", noErrorOnMissing: true }],
            }),
        ],
    };
    const envConfig = require(path.resolve(__dirname, `./webpack.${env.mode}.js`))(env);

    const mergedConfig = merge(config, envConfig);

    return mergedConfig;
};
