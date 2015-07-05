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

var onAnswer = function(curWS, data) {
    var serverChatData = checkIfExist(data);
    if (!serverChatData) {
        var strErr = JSON.stringify({
            message: (new Error('Chat with requested id not found!')).toString(),
            type: "error",
            chat_description: data.chat_description
        });
        curWS.send(JSON.stringify(strErr));
        return;
    }

    if (!serverChatData.chat_description.offer) {
        var strErr = JSON.stringify({
            message: (new Error('Chat with requested id does not have offer!')).toString(),
            type: "error",
            chat_description: serverChatData.chat_description
        });
        curWS.send(JSON.stringify(strErr));
        return;
    }

    if (serverChatData.chat_description.answer) {
        var strErr = JSON.stringify({
            message: (new Error('Chat with requested id already has answer!')).toString(),
            type: "error",
            chat_description: serverChatData.chat_description
        });
        curWS.send(JSON.stringify(strErr));
        return;
    } else {
        serverChatData.chat_description.answer = {
            answerDescription: data.answerDescription,
            userId: data.userId
        };
    }

    var responseData = {
        type: 'notifyChat',
        notify_data: 'serverStoredAnswer',
        chat_description: serverChatData.chat_description,
        userId: data.userId
    };

    storeWebSocketInChatData(curWS, serverChatData);
    broadcastChat(serverChatData, responseData);

    console.log('Answer from', 'userId = ' + responseData.userId, 'chatId = ' + serverChatData.chat_description.chatId);
};

var onAccept = function(curWS, data) {
    var serverChatData = checkIfExist(data);
    if (!serverChatData) {
        var strErr = JSON.stringify({
            message: (new Error('Chat with requested id not found!')).toString(),
            type: "error",
            chat_description: data.chat_description
        });
        curWS.send(JSON.stringify(strErr));
        return;
    }

    if (!serverChatData.chat_description.offer) {
        var strErr = JSON.stringify({
            message: (new Error('Chat with requested id does not have offer!')).toString(),
            type: "error",
            chat_description: serverChatData.chat_description
        });
        curWS.send(JSON.stringify(strErr));
        return;
    }

    if (!serverChatData.chat_description.answer) {
        var strErr = JSON.stringify({
            message: (new Error('Chat with requested id does not have answer!')).toString(),
            type: "error",
            chat_description: serverChatData.chat_description
        });
        curWS.send(JSON.stringify(strErr));
        return;
    }

    var responseData = {
        type: 'notifyChat',
        notify_data: 'chatConnectionEstablished',
        chat_description: serverChatData.chat_description,
        userId: data.userId
    };

    storeWebSocketInChatData(curWS, serverChatData);
    broadcastChat(serverChatData, responseData);

    console.log('Accept from', 'userId = ' + responseData.userId, 'chatId = ' + serverChatData.chat_description.chatId);
};

var server_message_router = new Server_message_router();

expressApp.use(express.static(fullPath));

expressApp.ws(websocketPath, function(ws, req) {
    ws.on('message', function(messageData) {
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