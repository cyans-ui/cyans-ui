const webpack = require('webpack');
const path = require('path');

const debug = process.env.NODE_ENV !== 'production';

module.exports = {
  devtool: debug ? 'inline-sourcemap' : false,
  entry: './index.js',
  output: {
    path: process.cwd() + '/dist',
    filename: 'index.min.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: process.cwd(),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.postcss$/,
        include: process.cwd(),
        exclude: /node_modules/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(process.cwd(), '../', '../', 'postcss.config.js')
              }
            }
          }
        ]
      }
    ]
  },
  plugins: debug ? [] : [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
  ]
};
