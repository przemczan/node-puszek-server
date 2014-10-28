var Config = require('./config.js');

var DB = require("./lib/database").connect(Config.mongo.uri);

var wsServer = require('./lib/wsServer');
var httpServer = require('./lib/httpServer');

DB.getConnection().on('open', function() {
    wsServer.run(Config.wsServer.port);

    httpServer.onMessage = function(_message) {
        wsServer.handleIncomingMessage(_message);
    };

    httpServer.run(Config.httpServer.port);
});

