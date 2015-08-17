var express = require('express'),
    Server_message_router = require('./development/js/node_modules/server_message_router'),
    expressApp      = express(),
    port            = 8888,
    dirPath = '/development',
    path = require('path'),
    fullPath = path.join(__dirname, dirPath),
    fs = require('fs'),
    websocketPath = '/websocket',
    expressWs = require('express-ws')(expressApp);

var server_message_router = new Server_message_router();

expressApp.use(express.static(fullPath));

expressApp.ws(websocketPath, function(ws, req) {
    ws.on('message', function(messageData) {
        //var wss =expressWs.getWss(websocketPath);
        //wss.clients
        server_message_router.onMessage(this, messageData);
    });
    console.log('WebSocket request type', req.method + ' from ' + req.originalUrl);
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