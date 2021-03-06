const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	plugins: [
		new HtmlWebpackPlugin({
			title: 'chatterbox',
			meta: [
				// viewport meta tag for responsiveness / media queries
				{
					name: 'viewport',
					content:
						'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0',
				},
			],
			template: require('html-webpack-template'),
			favicon: './src/public/favicon.ico',
			appMountId: 'root',
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
	devServer: {
		hot: true, // enable hot reloading
		overlay: true, // error overlay
		historyApiFallback: {
			disableDotRule: true,
		},
		proxy: {
			'/api': 'http://0.0.0.0::3030',
		},
		host: '0.0.0.0', //your ip address
		port: 8080,
		transportMode: 'ws',
	},
});
