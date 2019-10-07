const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new NodemonPlugin(),
  ],
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
      },
    ],
  },
  resolve: {
    alias: {
      db: path.resolve(__dirname, './src/db.js'),
    },
  },
};
