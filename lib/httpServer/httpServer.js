var Http = require('http');
var Qs = require('qs');
var Url = require('url');
var Model = require('../../model');
var Validators = require('../validators');
var Logger = require('../logger').child({ component: 'httpServer' });
var Uuid = require('node-uuid').v1;
var Config = require('../../config');
var Repository = require('../../repository');
var Mongoose = require('mongoose');
var HttpResponse = require('./HttpResponse');

var httpServer, port,
    authHeaderClientName = Config.httpServer.headersPrefix + 'client-name',
    authHeaderSecurityHash = Config.httpServer.headersPrefix + 'security-hash';

/**
 *
 * @param _error
 */
function onError(_error) {
    Logger.fatal({ error: _error, event: 'onError' });
    process.exit(0);
}

/**
 *
 */
function onOpen() {
    Logger.info('Listening on port ' + port);
}

/**
 *
 * @param _request
 * @param _errorCallback
 * @param _successCallback
 * @returns {string}
 */
function authenticateRequest(_request, _errorCallback, _successCallback) {
    if (typeof _request.headers[authHeaderClientName] == 'undefined') {
        return _errorCallback('client-name parameter not found');
    }
    if (typeof _request.headers[authHeaderSecurityHash] == 'undefined') {
        return _errorCallback('security-hash parameter not found');
    }

    _request.logger.info({ data: _request.post, hash: _request.headers[authHeaderSecurityHash] }, 'auth data');

    Repository.Client.verifyString(
        _request.headers[authHeaderClientName], _request.post.raw, _request.headers[authHeaderSecurityHash],
        _errorCallback, _successCallback
    );
}

/**
 *
 * @param _request
 * @param _response
 * @param _callback
 * @returns {null}
 */
function processPost(_request, _response, _callback) {

    if (typeof _callback !== 'function') {
        return null;
    }

    var data = "";

    if (_request.method == 'POST') {
        _request.on('data', function(_data) {
            data += _data;
            if (data.length > 1e6) {
                data = "";
                _response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                _request.connection.destroy();
            }
        });

        _request.on('end', function() {

            var decodedData = null;

            if (typeof data == 'string' &&
                _request.headers['content-type'] && _request.headers['content-type'] == 'application/json'
            ) {
                decodedData = JSON.parse(data);
            }

            _callback({
                raw: data,
                decoded: decodedData
            });
        });

    } else {
        _response.writeHead(405, {'Content-Type': 'text/plain'});
        _response.end();
    }
}

/**
 * Nowe żądanie http
 * @param _request
 * @param _response
 */
function onRequest(_request, _response) {

    _request.logger = Logger.child({ request: Uuid() });
    _request.logger.info({ url: _request.url }, 'new request');

    /**
     * @param _httpResponse
     */
    function sendResponse(_httpResponse) {
        _httpResponse.send();
        _request.logger.info({ sentResponse: _httpResponse });
    }

    /**
     * Get POST data
     */
    processPost(_request, _response, function(_data) {
        _request.logger.info({ body: _data }, 'got request body');
        _request.post = _data;
        authenticateRequest(_request, onAuthenticationError, onAuthenticationSuccess);
    });

    /**
     * Authentication error occured
     * @param _error
     */
    function onAuthenticationError(_error) {

        _request.logger.info({ authenticationError : _error });
        sendResponse(HttpResponse.create(_response).failed().message('Authentication failed').status(403));
    }

    /**
     * Authentication success
     */
    function onAuthenticationSuccess(_client) {

        var urlParams = Url.parse(_request.url);
        var queryParams = Qs.parse(urlParams.query);

        switch (urlParams.pathname) {

            // SEND MESSAGE
            case '/send-message':
                var errors = Validators.run(Validators.httpSendMessage, {
                    post: _request.post,
                    url: {
                        query: queryParams
                    }
                });

                if (errors.count) {
                    _request.logger.info({ validationErrors: errors }, 'Invalid input');
                    sendResponse(HttpResponse.create(_response).failed().errors(errors));
                } else {
                    var message = new Model.Message({
                        client: Mongoose.Types.ObjectId(_client._id),
                        sender: _request.post.decoded.sender,
                        receivers: _request.post.decoded.receivers,
                        message: _request.post.decoded.message
                    });
                    message.save(function(_error, _message) {
                        if (_error) {
                            _request.logger.info({ error: _error }, 'Message save error');
                            sendResponse(HttpResponse.create(_response).failed().errors(_error));
                        } else {
                            sendResponse(HttpResponse.create(_response));
                            module.exports.onMessage(_message);
                        }
                    });
                }
                break;

            // PAGE NOT FOUND
            default:
                _request.logger.info('Page not found.');
                sendResponse(HttpResponse.create(_response).failed().status(404));
        }
    }
}


module.exports = {
    /**
     *
     * @param _port
     * @returns {exports}
     */
    run: function(_port) {
        port = _port || 5001;
        httpServer = Http.createServer(onRequest);
        httpServer.on('error', onError);
        httpServer.listen(port, onOpen);

        return this;
    },

    /**
     * on message event
     */
    onMessage: function() {}
};
