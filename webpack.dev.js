'use strict';

const merge = require('webpack-merge');
const webpack = require('webpack');

const common = require('./webpack.common.js');


module.exports = merge(common, {
  entry: {
    index: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      './app/index.jsx',
    ],
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
