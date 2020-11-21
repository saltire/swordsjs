const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');

const common = require('./webpack.common.js');


module.exports = merge(common, {
  mode: 'development',
  entry: {
    index: path.resolve(__dirname, 'client/index.jsx'),
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  devServer: {
    contentBase: './dist',
    historyApiFallback: { index: '/' },
    proxy: { '/api': `http://localhost:${process.env.PORT || 3001}` },
    stats: 'minimal',
  },
  devtool: 'eval-source-map',
  plugins: [
    new HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
  ],
  stats: 'minimal',
});
