var express = require('express');
var rewrite = require('express-urlrewrite');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var WebpackConfig = require('./webpack.config');

var app = express();
app.use(webpackDevMiddleware(webpack(WebpackConfig), {
    publicPath: '/__build__/',
    stats: {
        colors: true
    }
}));

var fs = require('fs');
var path = require('path');
app.use(rewrite('/*', './index.html'));
app.use(express.static(__dirname));

app.listen(7777, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Server listening on http://localhost:7777, Ctrl+C to stop;')
});