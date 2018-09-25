const webpack = require("webpack");

module.exports = {
	entry: {
		app: ['./src/App.jsx']
	},
	output: {
		path: __dirname + './static/',
		filename: 'app.bundle.js',
		chunkFilename: 'vendor.bundle.js'
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /node_modules/,
					chunks: 'initial',
					name: 'vendor',
					enforce: true
				}
			}
		}
	},
	module: {
		rules: [{
			test: /\.jsx$/,
			loader: 'babel-loader',
			query: {
				presets: ['@babel/preset-env', '@babel/preset-react']
			}
		}]
	},
	devServer:{
		hot: true,
		port: 8000,
		contentBase: 'static',
		proxy: {
			'/api/*': 'http://localhost:3000'
		}
		
	},
	plugins: [],
	devtool: 'source-map'
}