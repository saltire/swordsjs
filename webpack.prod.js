'use strict';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const common = require('./webpack.common.js');


module.exports = merge(common, {
  entry: {
    index: './app/index.jsx',
  },
  // devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin({
      // sourceMap: true,
    }),
  ],
});
