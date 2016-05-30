var path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractPlugin = require('extract-text-webpack-plugin'),
  production = process.env.NODE_ENV === 'production';

module.exports = {
  
  debug: !production,
  
  // devtool: production ? null : 'inline-source-map',

  watch: !production,
  watcherOptions: {
    aggregateTimeout: 100
  },

  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },

  entry: {
    app: './js/index.js',
    vendor: ['react', 'react-dom', 'react-router']
  },
  
  output: {
    path: path.join(__dirname, '/__build__'),
    filename: production ? 'bundle.js?[chunkhash]' : 'bundle.js',
    publicPath: '/__build__/'
  },

  module: {
    loaders: [
      {
        test: /\.less$/,
        exclude: /(node_modules|bower_components)/,
        loader: ExtractPlugin.extract('style', 'css!less')
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.svg$/,
        exclude: /(node_modules|bower_components)/,
        loader: production ? 'file?name=svg/[name].[ext]?[hash]' : 'file?name=svg/[name].[ext]'
      },
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      favicon: './favicon.ico',
      template: './index.ejs',
      inject: 'body'
    }),
    new ExtractPlugin(production ? 'bundle.css?[chunkhash]' : 'bundle.css'),
    new webpack.optimize.CommonsChunkPlugin("vendor", production ? "vendor.js?[chunkhash]" : "vendor.js", Infinity),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};