var Http = require('http');
var Qs = require('qs');
var Url = require('url');
var Model = require('../model');
var Validators = require('./validators');

var httpServer, port;

/**
 *
 * @param _error
 */
function onError(_error) {
    console.log('Http server error:', _error);
    process.exit(0);
}

/**
 *
 */
function onOpen() {
    console.log('Http server: listening on port ' + port);
}

/**
 * Nowe żądanie http
 * @param _request
 * @param _response
 */
function onRequest(_request, _response) {

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
    console.log('New http request:', queryParams);

    switch (urlParams.pathname) {

        // SEND MESSAGE
        case '/send-message':
            var errors = Validators.run(Validators.httpSendMessage, { url: { query: queryParams } });

            if (errors.count) {
                console.log('Invalid input', errors);
                sendResponse(500);
            } else {
                var message = new Model.Message({
                    sender: queryParams.sender,
                    receivers: queryParams.receivers,
                    message: queryParams.message
                });
                message.save(function(_error, _message) {
                    if (_error) {
                        console.log('Message save error', _error);
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
            console.log('Page not found.');
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
