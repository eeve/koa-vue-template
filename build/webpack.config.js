const webpack = require('webpack')
const path = require('path')
const vueConfig = require('./vue-loader.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'

process.env.BABEL_ENV = 'client';

module.exports = {
	devtool: isProd
    ? false
    : '#cheap-module-source-map',
  entry: {
    'lib': path.resolve(__dirname, '../src/www/src/lib/vendor'),
    'app': path.resolve(__dirname, '../src/www/src/app')
  },
  output: {
    path: path.resolve(__dirname, '../src/www/dist'),
    publicPath: '/',
    jsonpFunction: 'Deploy',
    library: "deploy",
    libraryTarget: 'umd',
    filename: 'assets/[name]_[chunkhash:6].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.less'],
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
				loader: 'vue-loader',
				options: vueConfig
      },
      {
        test: /\.css$/,
				use: isProd
					? ExtractTextPlugin.extract({
              use: 'css-loader?minimize',
              fallback: 'vue-style-loader'
						})
					: [ 'vue-style-loader', 'css-loader' ]
      },
      {
        test: /\.less$/,
        use: [ 'style-loader', 'css-loader', 'less-loader' ]
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
	plugins: [
		new CopyWebpackPlugin([
			{ from: path.resolve(__dirname, '../src/favicon.ico') }
		]),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'lib',
			filename: 'lib.min.js?[hash]'
		}),
		new HtmlWebpackPlugin({
			inject: true,
			chunks: ['lib', 'app'],
			favicon: path.resolve(__dirname, '../src/favicon.ico'),
			template: path.resolve(__dirname, '../src/www/src/index.html'),
			filename: path.resolve(__dirname, '../src/www/dist/index.html')
		})
	].concat(
		isProd
			? [
					new webpack.optimize.UglifyJsPlugin({
						compress: { warnings: false }
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
			? false
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
