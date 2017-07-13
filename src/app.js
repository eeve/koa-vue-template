import Koa from 'koa';
import Logger from 'too-logger';
import Pug from 'koa-pug';
import favicon from 'koa-favicon';
import Serve from 'koa-static';
import path from 'path';
import config from './config';
import webpackDevMiddleware from '../build/webpack.dev';
import historyApiFallbackMiddleware from 'koa-connect-history-api-fallback';
const resolve = file => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'

const server = new Koa();
server.context.config = config;

const logger = new Logger();
server.context.logger = logger;

const pug = new Pug({
	viewPath: __dirname + '/views',
	debug: false,
  pretty: false,
	compileDebug: false,
	app: server
});

const serve = (path, cache) => Serve(resolve(path), {
	maxage: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
});
server.use(favicon(resolve('./favicon.ico')));
server.use(serve('../public', true));

if(!isProd) {
	server.use(historyApiFallbackMiddleware({ verbose: true, logger: logger.debug.bind(logger) }));
	server.use(webpackDevMiddleware);
  console.log('webpack-middleware start in...');
}

server.use(async(ctx, next) => {
	console.log('前置中间件...');
	return next();
});

server.listen(config.port);
logger.info(`Server running at http://localhost:${config.port}/`)
logger.info(`------------------------------------------------`)

