var express = require('express'),
    uuid = require('uuid'),
    expressApp      = express(),
    port            = 8888,
    dirPath = '/development',
    path = require('path'),
    fullPath = path.join(__dirname, dirPath),
    fs = require('fs'),
    websocketPath = '/websocket',
    expressWs = require('express-ws')(expressApp);

var chats = [];

var broadcastAll = function(data) {
    var wss = expressWs.getWss(websocketPath);
    if (!wss || data === undefined || data === null) {
        console.error(new Error('Error broadcasting data'));
        return;
    }
    var strData = data;
    if (typeof data !== 'string') {
        strData = JSON.stringify(data);
    }
    wss.clients.forEach(function each(client) {
        client.send(strData);
    });
};

var broadcastChat = function(serverChatData, broadcastData) {
    if (!serverChatData || broadcastData === undefined || broadcastData === null) {
        console.error(new Error('Error broadcasting data'));
        return;
    }
    var strData = broadcastData;
    if (typeof broadcastData !== 'string') {
        strData = JSON.stringify(broadcastData);
    }
    serverChatData['clients'].forEach(function(_webSocket) {
        _webSocket.send(strData);
    });
};

var readMainFile = function() {
  return fs.readFileSync(fullPath + '/index.html', 'utf8');
};

var checkIfExist = function(newChatData) {
    var oldChatData;
    chats.every(function(_chatData) {
        if (_chatData.chat_description.chatId === newChatData.chat_description.chatId) {
            oldChatData = _chatData;
        }
        return !oldChatData;
    });
    return oldChatData;
};

var checkOrGenerateChatId = function(oldChatData, currentAttempt, totalAttempts) {
    if (checkIfExist(oldChatData)) {
        if (currentAttempt < generateAttempts) {
            console.log('Try to generate chat new id, old chat id : ', oldChatData.chat_description.chatId);
            oldChatData.chat_description.chatId = uuid.v1();
            console.log('New chat id : ', oldChatData.chat_description.chatId);
            currentAttempt++;
            return checkOrGenerateChatId(oldChatData, currentAttempt, totalAttempts);
        }

        return new Error('Unable to generate new chat id!');
    }

    return oldChatData;
};

/**
 * tries to store chat by chat id in the server cash
 * @param webSocket
 * @param chatData
 */
var storeWebSocketInChatData = function(webSocket, chatData) {
    if (!chatData['clients']) {
        chatData['clients'] = [];
        chatData['clients'].push(webSocket);
    } else {
        var oldWebSocket;
        chatData['clients'].every(function(_webSocket) {
            if (_webSocket === webSocket) {
                oldWebSocket = _webSocket;
            }
            return !oldWebSocket;
        });
        if (!oldWebSocket) {
            chatData['clients'].push(webSocket);
        }
    }
};

var generateAttempts = 100;
var onCreateChat = function(curWS, data) {
    var correctedClientChatData = checkOrGenerateChatId(data, 0, generateAttempts);

    if (correctedClientChatData && correctedClientChatData instanceof Error) {
        console.error(correctedClientChatData);
        var strErr = JSON.stringify({
            message: correctedClientChatData.toString(),
            type: "error",
            chat_description: data.chat_description
        });
        curWS.send(JSON.stringify(strErr));
        return;
    }

    var responseData = {
        type: 'created',
        userId: data.userId,
        chat_description: correctedClientChatData.chat_description
    };
    storeWebSocketInChatData(curWS, correctedClientChatData);
    chats.push(correctedClientChatData);

    curWS.send(JSON.stringify(responseData));

    console.log('Create chat from', 'userId = ' + correctedClientChatData.userId, 'chatId = ' + correctedClientChatData.chat_description.chatId);
};

var onJoinChat = function(curWS, data) {
    var serverChatData = checkIfExist(data);
    var responseData = {
        type: 'joined',
        userId: data.userId
    };

    if (serverChatData) {
        responseData.chat_description = serverChatData.chat_description;
    } else {
        // chat is not exist on the server
        serverChatData = {
            chat_description: data.chat_description
        };
        responseData.chat_description = serverChatData.chat_description;
        chats.push(serverChatData);
    }

    storeWebSocketInChatData(curWS, serverChatData);

    //broadcastChat(serverChatData, responseData);
    curWS.send(JSON.stringify(responseData));

    console.log('Join chat from', 'userId = ' + responseData.userId, 'chatId = ' + serverChatData.chat_description.chatId);
};

var onOffer = function(curWS, data) {
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

    var responseData = {
        type: 'notifyChat',
        notify_data: 'serverStoredOffer'
    };

    if (!serverChatData.chat_description.offer) {
        serverChatData.chat_description.offer = {
            offerDescription: data.offerDescription,
            userId: data.userId
        };
        responseData.userId = data.userId;
    } else {
        // somebody created offer before this request...
    }
    responseData.chat_description = serverChatData.chat_description;

    storeWebSocketInChatData(curWS, serverChatData);
    broadcastChat(serverChatData, responseData);

    console.log('Offer from', 'userId = ' + responseData.userId, 'chatId = ' + serverChatData.chat_description.chatId);
};

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

var msgMap = {
    create: onCreateChat,
    join: onJoinChat,
    offer: onOffer,
    answer: onAnswer,
    accept: onAccept
};

var onMessage = function(data) {
    try {
        var parsedData = JSON.parse(data);
        var handler = msgMap[parsedData.type];
        if (handler) {
            handler(this, parsedData);
        }
    } catch (e) {
        console.log(e);
    }
};

expressApp.use(express.static(fullPath));

expressApp.ws(websocketPath, function(ws, req) {
    ws.on('message', onMessage);
    console.log('WebSocket request type', req.method + ' from ' + req.originalUrl);
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