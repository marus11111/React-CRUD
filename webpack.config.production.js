var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    script: './frontend/entry.jsx',
    vendor: ['babel-polyfill', './frontend/js/modernizr/modernizr-custom', 'axios', 'react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'history', 'react-router', 'react-router-redux', 'redux-form', 'react-rte', 'react-dropzone']
  },
  output: {
    path: './dist/',
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: ['babel-loader?' + JSON.stringify({
          presets: [['es2015', {
            modules: false
          }], 'stage-0', 'react']
        })]
            },
      {
        test: /\.scss$/i,
        loader: ExtractTextPlugin.extract({
          loader: ['css-loader', 'postcss-loader', 'sass-loader']
        })
            },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: ['file-loader', 'img-loader']
            }
        ]
  },
  plugins: [
        new HtmlPlugin({
      template: './frontend/index.html'
    }),
        new ExtractTextPlugin('style.[contenthash].css'),
        new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
        new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
        new OptimizeCssAssetsPlugin(),
        new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
        new CopyWebpackPlugin([{
      from: 'backend/'   
    }])
    ]
}
