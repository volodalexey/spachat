var express = require('express');
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
var redirectToStatic = function(req, res, next) {
  if (req.url.indexOf('/index.html/') >= 0) {
    console.log('from', req.url);
    req.url = req.url.split('/index.html')[1];
    console.log('to', req.url);
    next();
  } else {
    next()
  }
};
var returnIndexFile = function(req, res, next) {
  var fullPath = path.join(__dirname, './index.html');
  fs.stat(fullPath, function(err, fileStat) {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/html'});
      res.end(err, 'utf-8');
      return;
    }

    if (fileStat.isFile() !== true) {
      res.writeHead(500, {'Content-Type': 'text/html'});
      res.end('Is not a file', 'utf-8');
      return;
    }

    fs.readFile(fullPath, 'utf-8', function(err, fileContent) {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.end(err, 'utf-8');
        return;
      }

      res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': fileStat.size});
      res.end(fileContent, 'utf-8');
    });
  });
};
app.use(redirectToStatic);
app.use(express.static(__dirname));
app.use(returnIndexFile);

console.log("__dirname", __dirname);

app.listen(7777, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Server listening on http://localhost:7777, Ctrl+C to stop;')
});