var Config = require('./config.js');

var url = require('url');
var util = require('util');
var http = require("http");
var DB = require("./lib/database").connect(Config.mongo.uri);
var Model = require('./model');

var wsServer = require('./lib/wsServer');
var httpServer = require('./lib/httpServer');

wsServer.run(Config.wsServer.port);

httpServer.onMessage = function(_message) {
    wsServer.handleIncomingMessage(_message);
};

httpServer.run(Config.httpServer.port);

