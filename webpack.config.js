var path = require("path");
const webpack = require('webpack');
// var precss = require('precss');
// var autoprefixer = require('autoprefixer');
// var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    // devtool: 'cheap-module-source-map',
    context: path.join(__dirname, "app"),
    entry: {
        app: "./jsx/Route.jsx",
        // vendor: "./vendor.js",
    },
    output: {
        path: path.join(__dirname, "assets/js"),
        filename: "[name].js"
    },
    // plugins: [
    //   new webpack.DefinePlugin({
    //     'process.env': {
    //       'NODE_ENV': JSON.stringify('production')
    //     }
    //   })
    // ],
    module: {
        loaders: [
            /*{
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    "style",
                    "css!sass!postcss"
                )
                // loaders: ['style', 'css', 'sass', 'postcss']
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                // exclude: /node_modules/,
                loader: 'file-loader?name=../fonts/[name].[ext]',
            },*/
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    plugins: [
        //new ExtractTextPlugin("../css/[name].css")
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ],
    /*postcss: function () {
        return [precss, autoprefixer];
    }*/
}