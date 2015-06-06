var express = require('express')
    , uuid = require('uuid')
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

var checkIfExist = function(newChat) {
    var oldChat;
    chats.every(function(_chat) {
        if (_chat.chatId === newChat.chatId) {
            oldChat = _chat;
        }
        return !oldChat;
    });
    return oldChat;
};

var checkOrGenerateChatId = function(oldChat, currentAttempt, totalAttempts) {
    if (checkIfExist(oldChat)) {
        if (currentAttempt < generateAttempts) {
            console.log('Try to generate chat new id, old chat id : ', oldChat.chatId);
            oldChat.chatId = uuid.v1();
            console.log('New chat id : ', oldChat.chatId);
            currentAttempt++;
            return generateChatId(oldChat, currentAttempt, totalAttempts);
        }

        return new Error('Unable to generate new chat id!');
    }

    return oldChat;
};

var generateAttempts = 100;
var onCreateChat = function(data) {
    var generated = checkOrGenerateChatId(data.chat_description, 0, generateAttempts);

    if (generated && generated instanceof Error) {
        console.error(generated);
        var strErr = JSON.stringify({
            message: generated.toString(),
            type: "error",
            chat_description: data.chat_description
        });
        _ws.send(strErr);
        return;
    }

    data.type = 'created';
    chats.push(data.chat_description);
    _ws.send(JSON.stringify(data));
};

var onLocalOffer = function(data) {
    var oldChat = checkIfExist(data.chat_description);
    if (!oldChat) {
        var strErr = JSON.stringify({
            message: (new Error('Chat with requested id not found!')).toString(),
            type: "error",
            chat_description: data.chat_description
        });
        _ws.send(strErr);
        return;
    }

    if (!oldChat['peers']) {
        oldChat['peers'] = {};
    }
    if (!oldChat['peers'][data.chat_description.userId]) {
        oldChat['peers'][data.chat_description.userId] = {};
    }
    oldChat['peers'][data.chat_description.userId]['localOfferDescription'] = data.localOfferDescription;
    data.type = 'notifyChat';
    data.notify_data = 'localOfferStored';
    _ws.send(JSON.stringify(data));
};

var msgMap = {
    "create": onCreateChat,
    "localOffer": onLocalOffer
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