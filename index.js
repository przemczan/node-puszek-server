var Config = require('./config.js');

var DB = require("./lib/database").connect(Config.mongo.uri);

require('mongoose').set('debug', Config.mongo.debug);

var wsServer = require('./lib/wsServer');
var httpServer = require('./lib/httpServer');

DB.getConnection().on('open', function() {
    wsServer.run(Config.wsServer.port);
    httpServer.onMessage = wsServer.handleIncomingMessage;
    httpServer.run(Config.httpServer.port);
});

