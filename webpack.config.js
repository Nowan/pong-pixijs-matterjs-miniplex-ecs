/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");

const merge = require("webpack-merge").merge;

// plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FreeTexPackerPlugin = require("webpack-free-tex-packer");
const readdirSync = require("fs").readdirSync;

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
            new FreeTexPackerPlugin(
                ["src/assets/textures/cardsDeck"], //getDirectories("src/assets/textures"),
                "assets/textures",
                {
                    textureName: "atlas",
                    width: 512,
                    height: 512,
                    fixedSize: false,
                    padding: 2,
                    allowRotation: true,
                    detectIdentical: true,
                    allowTrim: true,
                    exporter: "Pixi",
                    removeFileExtension: false,
                    prependFolderName: true,
                },
            ),
            new CopyPlugin({
                patterns: [{ from: "textures/*.*", to: "assets", context: "src/assets/", noErrorOnMissing: true }],
                // patterns: [
                //     {
                //         from: "src/assets/**",

                //         // if there are nested subdirectories , keep the hierarchy
                //         to({ context, absoluteFilename }) {
                //             const assetsPath = path.resolve(__dirname, "src/assets");

                //             if (!absoluteFilename) {
                //                 throw Error();
                //             }

                //             const endPath = absoluteFilename.slice(assetsPath.length);

                //             return Promise.resolve(`assets/${endPath}`);
                //         },
                //     },
                // ],
            }),
        ],
    };
    const envConfig = require(path.resolve(__dirname, `./webpack.${env.mode}.js`))(env);

    const mergedConfig = merge(config, envConfig);

    return mergedConfig;
};

function getDirectories(source) {
    return readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => `${source}/${dirent.name}`);
}

function getFiles(source) {
    return readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => `${source}/${dirent.name}`);
}
