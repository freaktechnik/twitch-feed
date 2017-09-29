/* eslint-disable filenames/match-regex, eslint-comments/disable-enable-pair, no-var */
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanPlugin = require("clean-webpack-plugin");
const path = require("path");

var config = {
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name]-[hash].js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel',
                options: {
                    presets: [
                        [
                            'env',
                            {
                                useBuiltIns: true,
                                modules: false
                            }
                        ],
                        'react'
                    ]
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                options: {
                    presets: [
                        [
                            'env',
                            {
                                useBuiltIns: true,
                                modules: false
                            }
                        ]
                    ]
                }
            }
        ]
    },
    plugins: [
        new CleanPlugin([ 'build' ]),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: '"production"'
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/index.tmpl.html'
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("[name]-[hash].css"),
        new webpack.ProvidePlugin({
            fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ]
};

module.exports = config;
