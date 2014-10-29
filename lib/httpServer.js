var Http = require('http');
var Qs = require('qs');
var Url = require('url');
var Model = require('../model');
var Validators = require('./validators');
var Logger = require('./logger').child({ component: 'httpServer' });
var Uuid = require('node-uuid').v1;

var httpServer, port;

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
 * Nowe żądanie http
 * @param _request
 * @param _response
 */
function onRequest(_request, _response) {

    _request.logger = Logger.child({ request: Uuid() });

    /**
     * @param _status
     * @param _message
     */
    function sendResponse(_status, _message) {
        _status = _status || 500;

        _response.writeHead(_status);
        _response.end();
    }


    var urlParams = Url.parse(_request.url);
    var queryParams = Qs.parse(urlParams.query);

    _request.logger.info({ url: urlParams }, 'new request');

    switch (urlParams.pathname) {

        // SEND MESSAGE
        case '/send-message':
            var errors = Validators.run(Validators.httpSendMessage, { url: { query: queryParams } });

            if (errors.count) {
                _request.logger.info({ validationErrors: errors }, 'Invalid input');
                sendResponse(500);
            } else {
                var message = new Model.Message({
                    sender: queryParams.sender,
                    receivers: queryParams.receivers,
                    message: queryParams.message
                });
                message.save(function(_error, _message) {
                    if (_error) {
                        _request.logger.info({ error: _error }, 'Message save error');
                        sendResponse(500);
                    } else {
                        sendResponse(200);
                        module.exports.onMessage(_message);
                    }
                });
            }
            break;

        // PAGE NOT FOUND
        default:
            _request.logger.info('Page not found.');
            sendResponse(404);
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
