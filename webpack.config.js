const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devServer: {
    index: './index.html'
  },
  watch: true,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};