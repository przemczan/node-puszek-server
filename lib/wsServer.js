var Url = require('url');
var Qs = require("qs");
var NodeValidator = require("node-validator");
var Model = require('../model');
var Repository = require('../repository');
var WebSocketServer = require('ws').Server;
var Validators = require('./validators');
var Utils = require('./utils');

var wss, port;

/**
 *
 * @param _error
 */
function onError(_error) {
    console.log('WS server error:', _error);
    process.exit(0);
}

/**
 *
 */
function onOpen() {
    console.log('WS server: listening on port ' + port);
}

/**
 * Wysyłka wszystkich zaległych wiadomości do klienta
 * @param _ws
 */
function sendAllMessagesFor(_ws) {
	Repository.Message.getAllForClient(
        _ws,
        function (_error, _records) {
			if (_error) {
				console.log('Error fetching socket messages', _error);
				return;
			}
            // jeśli połączony
			if (1 == _ws.readyState) {
				for (var i = 0; i < _records.length; i++) {
					_ws.send(JSON.stringify(_records[i]));
				}
			}
		}
    );
}

/**
 * Połączenie klienta
 * @param _ws
 */
function onSocketConnect(_ws) {
    var urlParams = Url.parse(_ws.upgradeReq.url),
        queryParams = Qs.parse(urlParams.query),
        validationErrors = [];

    NodeValidator.run(Validators.socketUrlQuery, queryParams, function(_errorCount, _errors) {
        validationErrors = _errors;
    });

    if (validationErrors.length) {
        _ws.send(JSON.stringify({ errors: validationErrors }));
        _ws.close();
        return;
    }

    queryParams.subscribe.push(queryParams.receiver);

	_ws.data = {
			receiver: queryParams.receiver,
			subscribe: Utils.arrayUnique(queryParams.subscribe)
		};

    console.log('New socket connected: ', _ws.data);
	sendAllMessagesFor(_ws);

	_ws.on('message', function(_message) {
		// TODO?
	});
}

/**
 * Obsługa nowej wiadomości
 * @param _message
 */
function handleIncomingMessage(_message) {
    var client;
    for (var i in wss.clients) {
        client = wss.clients[i];
        if (client.data.subscribe.length) {
            for (var s in client.data.subscribe) {
                if (_message.receivers.indexOf(client.data.subscribe[s]) > -1) {
                    client.send(JSON.stringify(_message));
                    break;
                }
            }
        }
    }
}

module.exports = {
    'run': function (_port) {
        port = _port || 5000;
        wss = new WebSocketServer({ 'port': port });
        wss.on('error', onError);
        wss.on('listening', onOpen);
        wss.on('connection', onSocketConnect);

        return this;
    },

    'handleIncomingMessage': handleIncomingMessage
};