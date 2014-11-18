function HttpResponse(_response) {
    /**
     * Empty response object
     * @type {*}
     * @private
     */
    var self = this,
        status = 200,
        responseData = {
            success: true
        };

    /**
     * Sets message body
     * @param _message
     * @returns {*}
     */
    this.message = function(_message) {
        responseData.message = _message;

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
     * Sets success status
     * @param _success
     * @returns {*}
     */
    this.success = function(_success) {
        responseData.success = _success;

        return self;
    };

    /**
     * Sets success = false
     * @returns {*}
     */
    this.failed = function() {
        return self.success(false);
    };

    /**
     * Sets http headers response status
     * @returns {*}
     */
    this.status = function(_status) {
        status = _status;

        return self;
    };

    /**
     * @returns {*}
     */
    this.send = function() {
        _response.writeHead(status);
        _response.write(JSON.stringify(responseData));
        _response.end();

        return self;
    }
}

module.exports = {
    create: function(_response) {
        return new HttpResponse(_response);
    }
};
