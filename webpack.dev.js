const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

require('@babel/polyfill');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: [
    '@babel/polyfill',
    './src/index.js'
  ],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new NodemonPlugin()
  ],
  externals: [nodeExternals()], // ignore all node modules
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      }
    ],
  },
  resolve: {
    alias: {
      db: path.resolve(__dirname, './src/db'),
      api: path.resolve(__dirname, './src/api'),
      utils: path.resolve(__dirname, './utils'),
      helpers: path.resolve(__dirname, './helpers'),
    },
  },
};
