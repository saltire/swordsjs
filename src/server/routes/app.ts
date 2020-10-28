'use strict';

import express from 'express';
import history from 'connect-history-api-fallback';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfig from '../../webpack.dev.js';


const router = express.Router();
export default router;

const { publicPath } = webpackConfig.output;

// Rewrite all routes under /* (without a dot in the filename) to go to /
router.use(publicPath, history({ index: '/' }));

if (process.env.NODE_ENV === 'production') {
  // Serve already-compiled webpack content from the dist folder.
  router.use(publicPath, express.static(path.resolve(__dirname, '../../app')));
}
else {
  const compiler = webpack(webpackConfig);

  // Compile webpack content dynamically and serve it from express.
  router.use(webpackDevMiddleware(compiler, {
    publicPath,
    stats: 'minimal',
  }));

  // Use hot module loading.
  router.use(webpackHotMiddleware(compiler));
}
