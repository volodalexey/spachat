var fs = require('fs'),
  path = require('path'),
  httpServer = require('http'),
  server = httpServer.createServer(),
  port = 8081,
  index_file_path = 'index.html',
  public_path = './__build__/',
  rootFilePath = path.join(__dirname, public_path, index_file_path),
  webpack = require('webpack'),
  webpackDevMiddleware = require('webpack-dev-middleware'),
  webpack_config = require('./webpack.config'),
  id_Generator = require('./server_js/id_generator'),
  WebSocketServer = require('ws').Server,
  webSocketServer = new WebSocketServer({server: server}),
  web_socket_connections_collection = require('./server_js/web_socket_connections_collection'),
  clients = [],
  chats_descriptions = [],
  reqResMiddleware = webpackDevMiddleware(webpack(webpack_config), {
    publicPath: '/__build__/',
    stats: {
      colors: true
    }
  });

webSocketServer.on('connection', function(ws) {
    clients.push(ws);
    console.log('новое соединение');
    web_socket_connections_collection.on_wsc_open(ws);
    ws.on('message', function(messageData) {
      web_socket_connections_collection.on_wsc_message(ws, messageData);
    });
    ws.on('close', function(event) {
      clients.splice(clients.indexOf(ws), 1);
      web_socket_connections_collection.on_wsc_close(ws, event.code, event.message);
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
webSocketServer.on('error', function(err){
  console.log('server closed by error: '+err);
});
web_socket_connections_collection.apply_wss(clients, chats_descriptions);

// convert any objects to JSON string format
var toJSON = function(_object) {
  return JSON.stringify(_object);
};

// read async file by provided path
var readStaticFile = function(options, req, res) {

  fs.stat(options.fullPath, function(err, fileStat) {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/json'});
      res.end(toJSON(err), 'utf-8');
      return;
    }

    if (fileStat.isFile() !== true) {
      res.writeHead(500, {'Content-Type': 'text/json'});
      res.end(toJSON({message: 'Is not a file'}), 'utf-8');
      return;
    }

    fs.readFile(options.fullPath, options.encoding, function(err, fileContent) {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/json'});
        res.end(toJSON(err), 'utf-8');
        return;
      }

      console.log(options.fullPath, options.encoding, options.contentType, fileStat.size);
      res.writeHead(200, {'Content-Type': options.contentType, 'Content-Length': fileStat.size});
      res.end(fileContent, options.encoding);
    });
  });
};

server.on('request', function(req, res) {
  reqResMiddleware(req, res, function() {
    var fullPath, extName, contentType, encoding, url = req.url.indexOf('?') >= 0 ? req.url.split('?')[0] : req.url;
    if (url === '/api/uuid') {
      res.writeHead(200, {'Content-Type': 'text/json'});
      res.end(toJSON({uuid: id_Generator.generateId()}), 'utf-8');
    } else {
      fullPath = rootFilePath;
      extName = path.extname(fullPath);
      switch (extName) {
        case '.html':
          contentType = 'text/html';
          encoding = 'utf-8';
          break;
      }
      readStaticFile({contentType: contentType, encoding: encoding, fullPath: fullPath}, req, res);
    }
  });
});
server.listen(port, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Server listening on http://localhost:' + server.address().port + ', Ctrl+C to stop;');
});