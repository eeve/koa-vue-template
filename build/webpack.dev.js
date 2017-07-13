import path from 'path';
import webpack from 'webpack';
import middleware from 'koa-webpack';
import conf from './webpack.config';

export default middleware({
	compiler: webpack(conf),
	dev: {
    stats: { colors: true },
    contentBase: path.resolve(__dirname, '../src/www/dist'),
		publicPath: conf.output.publicPath,
		index: 'index.html',
    quiet: false,
    noInfo: true
  },
  hot: {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }
});
