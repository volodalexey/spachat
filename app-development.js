var express = require('express'),
    web_socket_connections_collection = require('./development/js/node_modules/web_socket_connections_collection'),
    expressApp      = express(),
    port            = 8888,
    dirPath = '/development',
    path = require('path'),
    fullPath = path.join(__dirname, dirPath),
    fs = require('fs'),
    websocketPath = '/websocket',
    expressWs = require('express-ws')(expressApp);

expressApp.use(express.static(fullPath));

web_socket_connections_collection.apply_wss(expressWs.getWss(websocketPath));
expressApp.ws(websocketPath, function(ws, req) {
    web_socket_connections_collection.on_wsc_open(ws);
    ws.on('message', function(messageData) {
        web_socket_connections_collection.on_wsc_message(this, messageData);
    });
    ws.on('close', function(code, message) {
        web_socket_connections_collection.on_wsc_close(this, code, message);
    });
});

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

expressApp.listen(port);
console.log('Listening on port: ', port);