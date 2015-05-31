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

//expressApp.use('/login', function(req, res) {
//    console.log(req.method + ' ' + req.url);
//    res.send(readMainFile());
//});
//
//expressApp.use('/chat', function(req, res) {
//    console.log(req.method + ' ' + req.url);
//    res.send(readMainFile());
//});
//
//expressApp.use('/cc', function(req, res) {
//    console.log('set cookie');
//    console.log(req.method + ' ' + req.url);
//    //res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
//    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
//    res.redirect('/chat');
//    //res.send(readMainFile());
//});

expressApp.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
        console.log(msg);
    });
    console.log('socket', req);
});

expressApp.listen(port);
console.log('Listening on port: ', port);