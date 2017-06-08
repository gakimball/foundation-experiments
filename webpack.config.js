const path = require('path');

module.exports = {
  context: __dirname,
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname,
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      'foundation-core': path.resolve(__dirname, 'core'),
      'foundation': path.resolve(__dirname, 'js'),
      'foundation-react': path.resolve(__dirname, 'react'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
