var express = require('express')
    , expressApp      = express()
    , port            = 8888
    , dirPath = '/development'
    , path = require('path')
    , fullPath = path.join(__dirname, dirPath)
    , fs = require('fs')
    , expressWs = require('express-ws')(expressApp);

var chats = [];

var readMainFile = function() {
  return fs.readFileSync(fullPath + '/index.html', 'utf8');
};

var onCreateChat = function(data) {
    var oldChat;
    chats.every(function(_chat) {
        if (_chat.chatId === data.chatId) {
            oldChat = _chat;
        }
        return !oldChat;
    });
    if (oldChat) {
        console.error(new Error('Chat is already registered!'));
    }

    chats.push(data);
};

var msgMap = {
    "create": onCreateChat
};

var onMessage = function(data) {
    try {
        var parsedData = JSON.parse(data);
        var handler = msgMap[parsedData.type];
        if (handler) {
            handler(parsedData);
        }
    } catch (e) {
        console.log(e);
    }
};

expressApp.use(express.static(fullPath));

expressApp.ws('/websocket', function(ws, req) {
    ws.on('message', onMessage);
    console.log('socket', req.method + ' ' + req.originalUrl);
});

expressApp.get('/', function(req, res) {
    console.log(req.method + ' ' + req.originalUrl);
    res.send(readMainFile());
});

expressApp.get('/login', function(req, res) {
    console.log(req.method + ' ' + req.originalUrl);
    res.send(readMainFile());
});

expressApp.get('/chat', function(req, res) {
    console.log(req.method + ' ' + req.originalUrl);
    res.send(readMainFile());
});

expressApp.listen(port);
console.log('Listening on port: ', port);