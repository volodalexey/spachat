var express = require('express')
    , expressApp      = express()
    , port            = 8888
    , dirPath = '/development'
    , path = require('path')
    , fullPath = path.join(__dirname, dirPath)
    , fs = require('fs');

var staticOptions = {
    'index': ['index.html']
};

expressApp.use(express.static(fullPath, staticOptions));

expressApp.listen(port);
console.log('Listening on port: ', port);