/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const merge = require("webpack-merge").merge;

// plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FreeTexPackerPlugin = require("./devscripts/FreeTexPackerPlugin");

const packerOptions = {
    fixedSize: false,
    padding: 2,
    allowRotation: true,
    detectIdentical: true,
    allowTrim: true,
    exporter: "Pixi",
    removeFileExtension: false,
    prependFolderName: true,
};

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
            new FreeTexPackerPlugin({
                from: "src/assets/textures/cardsDeck",
                to: "assets/textures/",
                options: { textureName: "cardsDeck.atlas", ...packerOptions },
            }),
            new CopyPlugin({
                patterns: [{ from: "textures/*.*", to: "assets", context: "src/assets/", noErrorOnMissing: true }],
            }),
        ],
    };
    const envConfig = require(path.resolve(__dirname, `./webpack.${env.mode}.js`))(env);

    const mergedConfig = merge(config, envConfig);

    return mergedConfig;
};
