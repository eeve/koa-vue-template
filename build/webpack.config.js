const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const isProd = process.env.NODE_ENV === 'production'

process.env.BABEL_ENV = 'client';

module.exports = {
	mode: isProd ? 'production' : 'development',
	name: 'default',
	devtool: isProd
    ? false
    : '#cheap-module-source-map',
  entry: {
    'lib': [path.resolve(__dirname, '../src/www/src/lib/vendor')],
    'app': [path.resolve(__dirname, '../src/www/src/app')]
  },
  output: {
    path: path.resolve(__dirname, isProd ? '../dist/www' : '../src/www/dist'),
    publicPath: '/',
    jsonpFunction: 'Deploy',
    library: "deploy",
    libraryTarget: 'umd',
    filename: 'assets/[name]_[hash:6].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.css'],
    alias: {
      vue: 'vue/dist/vue.common.js',
			lib: path.resolve(__dirname, '../src/www/src/lib'),
			public: path.resolve(__dirname, '../src/public')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
				use: 'vue-loader'
      },
      {
				test: /\.(css)$/,
				exclude: /node_modules/,
				use: isProd
					? [
						MiniCssExtractPlugin.loader,
						'css-loader',
						'postcss-loader'
					]
					: [
						'vue-style-loader',
						'css-loader',
						'postcss-loader'
					]
      },
      {
        test: /\.(gif|jpg|png|eot|ttf|woff|woff2|svg)$/,
				loader: 'url-loader',
				options: {
					limit: 8192,
					name: 'assets/[name].[ext]?[hash]'
				},
        exclude: /node_modules/
      }
    ]
	},
	performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					name: 'vendor',
					test: /[\\/]node_modules[\\/]/,
					chunks: 'initial' // 只打包初始时依赖的第三方
				},
				styles: {
					chunks: 'all',
					test: /.(css)/,
					name: 'styles',
					minChunks: 3,
					reuseExistingChunk: true,
					enforce: true
				}
			}
		}
	},
	plugins: [
		new VueLoaderPlugin(),
		new CopyWebpackPlugin([
			{ from: path.resolve(__dirname, '../src/favicon.ico') }
		]),
		new HtmlWebpackPlugin({
			inject: true,
			favicon: path.resolve(__dirname, '../src/favicon.ico'),
			template: path.resolve(__dirname, '../src/www/src/index.html'),
			filename: path.resolve(__dirname, isProd ? '../dist/www/index.html' : '../src/www/dist/index.html'),
			minify: isProd ? {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
				// More options:
				// https://github.com/kangax/html-minifier#options-quick-reference
			} : false
		})
	].concat(
		isProd
			? [
					new MiniCssExtractPlugin({
						filename: `assets/[name].[hash:8].css`,
						chunkFilename: `assets/[name].[hash:8].css`
					})
				]
			: [
				// new webpack.HotModuleReplacementPlugin(),
				new webpack.NoEmitOnErrorsPlugin(),
				new FriendlyErrorsPlugin()
			]
	),
	devServer:
		isProd
			? {}
			: {
				hot: true,
				quiet: false,
				inline: true,
				compress: true,
				contentBase: './dist',
				host: '0.0.0.0',
				disableHostCheck: true,
				historyApiFallback: true,
				port: 2000,
				proxy: {
					'/api': 'http://0.0.0.0:5000'
				}
			}
};
