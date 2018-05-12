var webpack = require("webpack");
var path = require("path");

module.exports = {
    devtool: 'inline-source-map',
    mode: 'development',
    entry: './example/index.js',
    //devtool: 'source-map',
    output: {
        path: __dirname,
        filename: './example/controller-example.js'
    },
    watchOptions: {
        ignored: '/node_modules/'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        // new webpack.ProvidePlugin({
        //     "window.decomp": 'poly-decomp'
        // }),
    ],
    module: {
        rules: [
            {test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }
}