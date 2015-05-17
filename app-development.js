var express = require('express')
    , expressApp      = express()
    , port            = 8888
    , dirPath = '/development'
    , path = require('path')
    , fullPath = path.join(__dirname, dirPath)
    , fs = require('fs')
    , expressWs = require('express-ws')(expressApp);

var staticOptions = {
    'index': ['index.html']
};

expressApp.use(express.static(fullPath, staticOptions));

expressApp.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
        console.log(msg);
    });
    console.log('socket', req);
});

expressApp.listen(port);
console.log('Listening on port: ', port);