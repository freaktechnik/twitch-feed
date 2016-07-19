var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanPlugin = require("clean-webpack-plugin");

var config = {
    entry: './src/index.jsx',
    output: {
        path: './build',
        filename: '[name]-[hash].js'
    },
    module: {
		loaders: [
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: [ 'es2015', 'react' ]
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
	    		query: {
	    			presets: [ 'es2015' ]
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
		new ExtractTextPlugin("[name]-[hash].css")
    ]
};

module.exports = config;

