import path from 'path';
import webpack from 'webpack';
import koaWebpack from 'koa-webpack';
import conf from './webpack.config';

export default koaWebpack({
	compiler: webpack(conf),
	devMiddleware: {
    stats: { colors: true },
    contentBase: path.resolve(__dirname, '../src/www/dist'),
		publicPath: conf.output.publicPath,
		index: 'index.html',
    quiet: false,
    noInfo: true
  },
  hotClient: {
		allEntries: true,
		hmr: true,
		reload: true
  }
});
