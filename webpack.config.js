const path = require('path')
const fs = require('fs')
const env = require('./util/env')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

// Load the secrets
const alias = {}
const secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js')

if (fs.existsSync(secretsPath)) {
	alias['secrets'] = secretsPath
}

const options = {
	mode: process.env.NODE_ENV || 'development',
	entry: {
		popup: path.join(__dirname, 'src', 'js', 'popup.js'),
		background: path.join(__dirname, 'src', 'js', 'background.js'),
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
				exclude: /node_modules/,
			},
			{
				test: new RegExp('.(' + ['png', 'svg'].join('|') + ')$'),
				loader: 'file-loader?name=[name].[ext]',
				exclude: /node_modules/,
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		alias: alias,
	},
	plugins: [
		// clean the build folder
		new CleanWebpackPlugin(),
		// expose and write the allowed env vars on the compiled bundle
		new webpack.EnvironmentPlugin(['NODE_ENV']),
		new CopyWebpackPlugin([
			{
				from: 'src/manifest.json',
				transform: function(content, path) {
					// generates the manifest file using the package.json information
					return Buffer.from(
						JSON.stringify({
							description: process.env.npm_package_description,
							version: process.env.npm_package_version,
							...JSON.parse(content.toString()),
						})
					)
				},
			},
		]),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'popup.html'),
			filename: 'popup.html',
			chunks: ['popup'],
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'background.html'),
			filename: 'background.html',
			chunks: ['background'],
		}),
		new WriteFilePlugin(),
	],
}

if (env.NODE_ENV === 'development') {
	options.devtool = 'cheap-module-eval-source-map'
}

module.exports = options
