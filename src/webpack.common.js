const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');


module.exports = {
  entry: {
    index: path.resolve(__dirname, 'app/index.jsx'),
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    hashDigestLength: 8,
    path: path.resolve(__dirname, '../built/app'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.s?css$/,
        use: ['css-hot-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|gif|png|eot|svg|ttf|woff2?)$/,
        use: [{
          loader: 'file-loader',
          options: { name: '[name].[hash:8].[ext]' },
        }],
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: { chunks: 'all' },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlPlugin({
      template: path.resolve(__dirname, 'app/index.ejs'),
      favicon: path.resolve(__dirname, 'app/static/favicon.ico'),
    }),
  ],
};
