var server = require('http').createServer(),
  port = 8081,
  express = require('express'),
  webpack = require('webpack'),
  webpackDevMiddleware = require('webpack-dev-middleware'),
  WebpackConfig = require('./webpack.config'),
  id_Generator = require('./server_js/id_generator'),
  app = express(),
  WebSocketServer = require('ws').Server,
  webSocketServer = new WebSocketServer({server: server}),
  web_socket_connections_collection = require('./server_js/web_socket_connections_collection'),
  clients = [],
  getDeleteClient = function(ws) {
    var deleteClient;
    clients.every(function(_client, index) {
      if (_client === ws) {
        deleteClient = index;
      }
      return !deleteClient;
    });

    return deleteClient;
  };

webSocketServer.on('connection', function(ws) {
    clients.push(ws);
    console.log('новое соединение');
    web_socket_connections_collection.on_wsc_open(ws);
    ws.on('message', function(messageData) {
      web_socket_connections_collection.on_wsc_message(this, messageData);
    });
    ws.on('close', function(event) {
      var position = getDeleteClient(ws);
      clients.splice(position, 1);
      web_socket_connections_collection.on_wsc_close(this, event.code, event.message);

      console.log('Connection close!');
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    });
    ws.on('error', function(error) {
      console.log('Error:' + error.message);
    });
  }
);
web_socket_connections_collection.apply_wss(clients);

app.use(webpackDevMiddleware(webpack(WebpackConfig), {
  publicPath: '/__build__/',
  stats: {
    colors: true
  }
}));

var fs = require('fs'),
  path = require('path'),
  redirectToStatic = function(req, res, next) {
    if (req.url.indexOf('/index.html/') >= 0) {
      console.log('from', req.url);
      req.url = req.url.split('/index.html')[1];
      console.log('to', req.url);
      next();
    } else {
      next()
    }
  },
  returnIndexFile = function(req, res, next) {
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
  res.status(200).send({uuid: id_Generator.generateId()});
});

app.use(redirectToStatic);
app.use(express.static(__dirname));
app.use(returnIndexFile);

server.on('request', app);
server.listen(port, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Server listening on ' + server.address().port + ', Ctrl+C to stop;');
});