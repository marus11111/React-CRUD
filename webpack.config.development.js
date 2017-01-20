var webpack = require('webpack');
var HtmlPlugin = require('html-webpack-plugin');

var vendorList = ['babel-polyfill', './src/modernizr/modernizr-custom', 'axios', 'react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'history', 'react-router', 'react-router-redux', 'redux-form', 'react-rte', 'react-dropzone']

module.exports = {
  entry: {
    script: './src/entry.jsx',
    vendor: vendorList
  },
  output: {
    path: './dist/',
    filename: '[name].js'
  },
  devServer: {
    inline: true,
    hot: true,
    contentBase: './dist',
    stats: 'errors-only',
    historyApiFallback: true,
    proxy: {
      '/project2': {
        target: 'http://marekwlodarczyk.pl',
        changeOrigin: true
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: ['babel-loader?' + JSON.stringify({
          presets: ['es2015', 'stage-0', 'react']
        })]
            },
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
            },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: ['file-loader', 'img-loader']
            }
        ]
  },
  plugins: [
        new HtmlPlugin({
      template: './src/index.html'
    }),
        new webpack.optimize.CommonsChunkPlugin({
      names: 'vendor'
    })
    ]
}
