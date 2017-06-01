module.exports = {
  context: __dirname,
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname,
  },
  devtool: 'source-map',
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
