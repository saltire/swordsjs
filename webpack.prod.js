'use strict';

const CleanPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const common = require('./webpack.common.js');


module.exports = merge(common, {
  mode: 'production',
  // devtool: 'source-map',
  plugins: [
    new CleanPlugin(['dist']),
    new UglifyJSPlugin({
      // sourceMap: true,
    }),
  ],
});
