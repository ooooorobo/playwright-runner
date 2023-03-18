const path = require("path");
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    target: "node",
    entry: {
        main: path.join(__dirname, 'src/index.ts'),
        "public/renderer": path.join(__dirname, "/src/view/renderer.ts")
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },
    node: {
        __dirname: false,
        __filename: false
    },
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                use: ["babel-loader"]
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: path.join(__dirname, 'src/view/index.html'),
            filename: "public/index.html",
            chunks: [],
            inject: true,
            publicPath: 'public'
        })
    ],
    externals: {
        bufferutil: "bufferutil",
        "utf-8-validate": "utf-8-validate",
    },
}
