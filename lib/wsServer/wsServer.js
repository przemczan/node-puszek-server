var Url = require('url');
var Qs = require("qs");
var NodeValidator = require("node-validator");
var Model = require('../../model');
var Repository = require('../../repository');
var WebSocketServer = require('ws').Server;
var Validators = require('../validators');
var Utils = require('../utils');
var Logger = require('../logger').child({ component: 'wsServer' });
var Uuid = require('node-uuid').v1;
var WsResponse = require('./WsResponse');

var wss, port;

/**
 *
 * @param _error
 */
function onError(_error) {
    Logger.fatal('WS server error:', _error);
    process.exit(0);
}

/**
 *
 */
function onOpen() {
    Logger.info('WS server: listening on port ' + port);
}

/**
 * Wysyłka wszystkich zaległych wiadomości do klienta
 * @param _ws
 */
function sendAllMessagesFor(_ws) {
	Repository.Message.getAllForUser(
        _ws,
        function (_error, _records) {
			if (_error) {
				_ws.logger.error({ error: _error });
				return;
			}
            // jeśli połączony
			if (1 == _ws.readyState) {
				for (var i = 0; i < _records.length; i++) {
                    WsResponse.create(_ws)
                        .type(WsResponse.TYPE_MESSAGE)
                        .data(_records[i])
                        .send();
				}
			}
		}
    );
}

/**
 * Obsługa nowej wiadomości
 * @param _message
 */
function handleIncomingMessage(_message) {
    var client;
    for (var i in wss.clients) {
        client = wss.clients[i];
        if (client.data.query.subscribe.length) {
            for (var s in client.data.query.subscribe) {
                if (_message.receivers.indexOf(client.data.query.subscribe[s]) > -1) {
                    WsResponse.create(client)
                        .type(WsResponse.TYPE_MESSAGE)
                        .data(_message)
                        .send();
                    break;
                }
            }
        }
    }
}

/**
 * Połączenie klienta
 * @param _ws
 */
function onSocketConnect(_ws) {
    _ws.logger = Logger.child({ socket: Uuid() });
    _ws.logger.info({ url: _ws.upgradeReq.url }, 'new socket connection');

    var validationErrors = [],
        urlParams = Url.parse(_ws.upgradeReq.url),
        queryParams = Qs.parse(urlParams.query),
        pathParams = Utils.parseUrlPath(urlParams.pathname);

    _ws.data = { query: queryParams, params: pathParams };

    NodeValidator.run(Validators.socketConnection, _ws, function(_errorCount, _errors) {
        validationErrors = _errors;
    });

    if (validationErrors.length) {
        _ws.logger.info({ validationErrors: validationErrors });
        WsResponse.create(_ws)
            .type(WsResponse.TYPE_ERROR)
            .errors(validationErrors)
            .send();
        _ws.close();

        return;
    }

    queryParams.subscribe.push(queryParams.receiver);
    queryParams.subscribe = Utils.arrayUnique(queryParams.subscribe);
    _ws.logger.info({ socketData: _ws.data });

    Repository.Client.verifyString(
        queryParams.client, urlParams.query, pathParams.named.hash,
        onAuthenticationError, onAuthenticationSuccess
    );

    /**
     *
     * @param _error
     */
    function onAuthenticationError(_error) {
        _ws.logger.info({ error: _error }, 'authentication failed');
        _ws.close();
    }

    /**
     * Authentication success
     */
    function onAuthenticationSuccess(_client) {
        _ws.logger.info('authentication success');
        _ws.data.client = _client;
        sendAllMessagesFor(_ws);
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
