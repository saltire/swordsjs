'use strict';

const merge = require('webpack-merge');
const { HotModuleReplacementPlugin } = require('webpack');

const common = require('./webpack.common.js');


module.exports = merge(common, {
  mode: 'development',
  entry: {
    index: [
      'webpack-hot-middleware/client',
      './app/index.jsx',
    ],
  },
  devtool: 'eval-source-map',
  plugins: [
    new HotModuleReplacementPlugin(),
  ],
});
