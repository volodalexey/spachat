var express = require('express')
    , expressApp      = express()
    , port            = 8888
    , dirPath = '/development'
    , path = require('path')
    , fullPath = path.join(__dirname, dirPath)
    , fs = require('fs')
    , expressWs = require('express-ws')(expressApp);

var chats = [];
var _ws;

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
        var err = new Error('Chat is already registered!');
        console.error(err);
        var strErr = JSON.stringify({
            message: err.toString(),
            type: "error"
        });
        _ws.send(strErr);
        return;
    }

    data.type = 'created';
    chats.push(data);
    _ws.send(JSON.stringify(data));
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
    _ws = ws;
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

expressApp.get('/register', function(req, res) {
    console.log(req.method + ' ' + req.originalUrl);
    res.send(readMainFile());
});

expressApp.get('/chat', function(req, res) {
    console.log(req.method + ' ' + req.originalUrl);
    res.send(readMainFile());
});

expressApp.listen(port);
console.log('Listening on port: ', port);