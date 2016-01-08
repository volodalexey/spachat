var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var WebpackConfig = require('./webpack.config');
var id_Generator = require('./server_js/id_generator');
var web_socket_connections_collection = require('./server_js/web_socket_connections_collection');
var websocketPath = '/websocket';
var app = express();
var expressWs = require('express-ws')(app);

app.ws(websocketPath, function(ws, req) {
  console.log('SERVER_received::', req);

  web_socket_connections_collection.on_wsc_open(ws);
  ws.on('message', function(messageData) {
    console.log('SERVER_received::', messageData);
    web_socket_connections_collection.on_wsc_message(this, messageData);
  });
  ws.on('close', function(code, message) {
    web_socket_connections_collection.on_wsc_close(this, code, message);
  });
});
web_socket_connections_collection.apply_wss(expressWs.getWss(websocketPath));

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
app.get('/api/uuid', function(req, res) {
  res.status(200).send({ uuid: id_Generator.generateId() });
});




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