'use strict';

const express = require('express');
const history = require('connect-history-api-fallback');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../../webpack.dev.js');


const router = module.exports = express.Router();

const { publicPath } = webpackConfig.output;

// Rewrite all routes under /* (without a dot in the filename) to go to /
router.use(publicPath, history({ index: '/' }));

if (process.env.NODE_ENV === 'production') {
  // Serve already-compiled webpack content from the dist folder.
  router.use(publicPath, express.static(path.resolve(__dirname, '../../dist')));
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
