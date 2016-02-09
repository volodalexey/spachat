'use strict';

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

module.exports = {

    devtool: 'inline-source-map',

    entry: "./js/main",
    output: {
        path: __dirname + '/__build__',
        filename: 'build.js',
        chunkFilename: '[id].chunk.js',
        publicPath: '/__build__/'
    },

    watch: true,

    watcherOptions: {
        aggregateTimeout: 100
    },

    resolve: {
        modulesDirectories: ['node_modules'],
        extension: ['', '.js', '.jsx']
    },

    resolveLoader: {
        modulesDirectories: ['node_modules'],
        moduleTemplates: ['*-loader', '*'],
        extension: ['', '.js', '.jsx']
    },

    module: {
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {
                test: /\.less$/,
                loader: 'style!css!less'
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin('shared.js'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
};