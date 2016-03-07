var server = require('http').createServer(),
  port = 8081,
  express = require('express'),
  webpack = require('webpack'),
  webpackDevMiddleware = require('webpack-dev-middleware'),
  WebpackConfig = require('./webpack.config'),
  id_Generator = require('./server_js/id_generator'),
  app = express(),
  WebSocketServer = require('ws').Server,
  webSocketServer = new WebSocketServer({server: server});

webSocketServer.on('connection', function(ws) {
    console.log('новое соединение');
    ws.on('open', function() {
      console.log('Connection open!');
    });

    ws.on('close', function(event) {
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