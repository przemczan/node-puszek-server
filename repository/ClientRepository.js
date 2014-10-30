var Client = require('../model/Client');
var Crypto = require('crypto');

module.exports = {
    /**
     *
     * @param _name
     * @param _callback
     */
    findByName: function(_name, _callback) {
        Client.findOne({ name: _name }, _callback);
    },

    /**
     *
     * @param _name
     * @param _string
     * @param _hash
     * @param _errorCallback
     * @param _successCallback
     */
    verifyString: function(_name, _string, _hash, _errorCallback, _successCallback) {
        module.exports.findByName(_name, function(_error, _client) {
            if (!_error) {
                if (_client) {
                    var validHash = Crypto.createHash('sha1')
                        .update(_client.privateKey)
                        .update(_string)
                        .digest('hex');

                    if (validHash != _hash) {
                        return _errorCallback('security-hash is invalid');
                    } else {
                        return _successCallback(_client);
                    }
                } else {
                    return _errorCallback({
                        client: _name,
                        message: 'client not found'
                    });
                }
            } else {
                return _errorCallback({
                    client: _name,
                    message: 'client not found',
                    error: _error
                });
            }
        });
    }
};