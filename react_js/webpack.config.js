var path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractPlugin = require('extract-text-webpack-plugin'),
  production = process.env.NODE_ENV === 'production';

module.exports = {
  
  debug: !production,
  
  devtool: production ? null : 'inline-source-map',

  watch: !production,
  watcherOptions: {
    aggregateTimeout: 100
  },

  entry: {
    app: './js',
    vendor: ['react', 'react-dom', 'react-router', 'history']
  },
  
  output: {
    path: path.join(__dirname, '/__build__'),
    filename: production ? 'bundle.js?[chunkhash]' : 'bundle.js',
    publicPath: '/__build__/'
  },

  module: {
    loaders: [
      {
        test: /\.css$/, 
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.svg$/,
        loader: production ? 'file?name=svg/[name].[ext]?[hash]' : 'file?name=svg/[name].[ext]'
      },
      {
        test: /\.json$/,
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