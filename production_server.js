var fs = require('fs'),
  path = require('path'),
  httpServer = require('http'),
  server = httpServer.createServer(),
  server_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8082,
  server_ip_address = process.env.OPENSHIFT_NODEJS_IP || 'localhost',
  index_file_path = 'index.html',
  public_path = '__build__',
  rootFilePath = path.join(__dirname, public_path, index_file_path),
  id_Generator = require('./server_js/id_generator'),
  WebSocketServer = require('ws').Server,
  webSocketServer = new WebSocketServer({server: server}),
  web_socket_connections_collection = require('./server_js/web_socket_connections_collection'),
  clients = [],
  chats_descriptions = [];

webSocketServer.on('connection', function(ws) {
    clients.push(ws);
    console.log('новое соединение');
    web_socket_connections_collection.on_wsc_open(ws);
    ws.on('message', function(messageData) {
      web_socket_connections_collection.on_wsc_message(this, messageData);
    });
    ws.on('close', function(event) {
      clients.splice(clients.indexOf(ws), 1);
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
  var fullPath, extName, contentType, encoding, url = req.url.indexOf('?') >= 0 ? req.url.split('?')[0] : req.url;
  if (url === '/api/uuid') {
    res.writeHead(200, {'Content-Type': 'text/json'});
    return res.end(toJSON({uuid: id_Generator.generateId()}), 'utf-8');
  } else if (url.indexOf(public_path) >= 0) {
    fullPath = path.join(__dirname, url);
  } else {
    fullPath = rootFilePath;
  }
  extName = path.extname(fullPath);
  switch (extName) {
    case '.html':
      contentType = 'text/html';
      encoding = 'utf-8';
      break;
    case '.js':
      contentType = 'text/javascript';
      encoding = 'utf-8';
      break;
    case '.css':
      contentType = 'text/css';
      encoding = 'utf-8';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      encoding = 'binary';
      break;
    case '.ico':
      contentType = 'image/x-icon';
      encoding = 'binary';
      break;
    case '.png':
      contentType = 'image/png';
      encoding = 'binary';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      encoding = 'utf-8';
      break;
  }
  readStaticFile({contentType: contentType, encoding: encoding, fullPath: fullPath}, req, res);
});
server.listen(server_port, server_ip_address, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Server listening on http://localhost:' + server.address().port + ', Ctrl+C to stop;');
});