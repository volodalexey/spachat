var express = require('express')
    , expressApp      = express()
    , port            = 8888
    , dirPath = '/development'
    , path = require('path')
    , fullPath = path.join(__dirname, dirPath)
    , fs = require('fs')
    , expressWs = require('express-ws')(expressApp);

var readMainFile = function() {
  return fs.readFileSync(fullPath + '/index.html', 'utf8');
};

expressApp.use(express.static(fullPath));

expressApp.use('/*', function(req, res) {
    console.log(req.method + ' ' + req.originalUrl);
    res.send(readMainFile());
});

expressApp.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
        console.log(msg);
    });
    console.log('socket', req);
});

expressApp.listen(port);
console.log('Listening on port: ', port);