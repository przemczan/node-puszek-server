var Crypto = require('crypto');


function WsResponse(_ws) {
    /**
     * Empty response object
     * @type {*}
     * @private
     */
    var self = this,
        responseData = {
            token: '',
            type: module.exports.TYPE_GENERAL
        };

    /**
     * Sets response data
     * @param _data
     * @returns {*}
     */
    this.data = function(_data) {
        responseData.data = _data;

        return self;
    };

    /**
     * Sets errors
     * @param _errors
     * @returns {*}
     */
    this.errors = function(_errors) {
        responseData.errors = _errors;

        return self;
    };

    /**
     * Sets response type
     * @returns {*}
     */
    this.type = function(_type) {
        responseData.type = _type;

        return self;
    };

    /**
     * @returns {*}
     */
    this.send = function() {
        // clear token
        responseData.token = '';
        var encoded = JSON.stringify(responseData);
        // generate token
        responseData.token = Crypto.createHash('sha1').update(encoded).digest('hex');
        // send updated response
        _ws.send(JSON.stringify(responseData));

        return self;
    }
}

module.exports = {
    create: function(_ws) {
        return new WsResponse(_ws);
    },

    TYPE_GENERAL: 'general',
    TYPE_ERROR: 'error',
    TYPE_MESSAGE: 'message'
};
