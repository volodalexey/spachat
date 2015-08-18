var express = require('express'),
    web_socket_connections_collection = require('./development/js/node_modules/web_socket_connections_collection'),
    expressApp      = express(),
    port            = 8888,
    dirPath = '/development',
    path = require('path'),
    fullPath = path.join(__dirname, dirPath),
    fs = require('fs'),
    websocketPath = '/websocket',
    expressWs = require('express-ws')(expressApp),
    id_Generator = require('./development/js/node_modules/id_generator');

expressApp.use(express.static(fullPath));

expressApp.ws(websocketPath, function(ws, req) {
    web_socket_connections_collection.on_wsc_open(ws);
    ws.on('message', function(messageData) {
        web_socket_connections_collection.on_wsc_message(this, messageData);
    });
    ws.on('close', function(code, message) {
        web_socket_connections_collection.on_wsc_close(this, code, message);
    });
});
web_socket_connections_collection.apply_wss(expressWs.getWss(websocketPath));

var readMainFile = function() {
    return fs.readFileSync(fullPath + '/index.html', 'utf8');
};

var commonStaticResponse = function(req, res) {
    console.log(req.method + ' ' + req.originalUrl);
    res.send(readMainFile());
};

expressApp.get('/', commonStaticResponse);

expressApp.get('/login', commonStaticResponse);

expressApp.get('/register', commonStaticResponse);

expressApp.get('/chat', commonStaticResponse);

expressApp.get('/api/uuid', function(req, res) {
    res.status(200).send({ uuid: id_Generator.generateId() });
});

expressApp.listen(port);
console.log('Listening on port: ', port);