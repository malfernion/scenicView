const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.ts',
  devServer: {
    index: './index.html'
  },
  watch: true,
  resolve: {
    alias: {
      'three/OrbitControls': path.join(__dirname, 'node_modules/three/examples/js/controls/OrbitControls.js'),
      'three/OBJLoader': path.join(__dirname, 'node_modules/three/examples/js/loaders/OBJLoader.js')
    }
  },
  plugins:[
    new webpack.ProvidePlugin({
      'THREE': 'three'
    })
  ],
  optimization: {
    minimize: false
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: './src/textures/'
  }
};