var express = require('express')
    , expressApp      = express()
    , port            = 8888
    , dirPath = '/development'
    , path = require('path')
    , fullPath = path.join(__dirname, dirPath)
    , fs = require('fs');

/*var staticOptions = {
    'index': ['index.html']
};*/

var indexHTML = fs.readFileSync(fullPath + '/index.html', 'utf8');

expressApp.use(express.static(fullPath));

expressApp.use('/', function(req, res) {
    res.send(indexHTML);
});

expressApp.use('/login', function(req, res) {
    res.send(indexHTML);
});

expressApp.use('/chat', function(req, res) {
    res.send(indexHTML);
});

expressApp.listen(port);
console.log('Listening on port: ', port);