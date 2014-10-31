var Validator = require("node-validator");


var receiverValidator = Validator.isString({ regex: /.+/i });

var expireDateValidator = {
    validate: function(_value, _onError) {

        if (module.exports.run(Validator.isNumber(), _value).count) {
            return _onError('Not a timestamp');
        }
        if (+new Date(_value) < +new Date()) {
            return _onError('Date expired');
        }
    }
};

var socketConnectionValidator = {
    validate: function (value, onError) {

        function validateCallback(_count, _errors) {
            if (_count) {
                for (var i in _errors) {
                    onError(_errors[i].message, _errors[i].parameter, _errors[i].value);
                }
            }
        }

        Validator.run(
            Validator
                .isObject()
                .withRequired('receiver', receiverValidator)
                .withRequired('client', Validator.isString())
                .withRequired('subscribe', Validator.isArray(receiverValidator))
                .withRequired('expire', expireDateValidator),
            value.data.query,
            validateCallback
        );

        Validator.run(
            Validator
                .isObject()
                .withRequired('hash', Validator.isString()),
            value.data.params.named,
            validateCallback
        );
    }
};

var httpSendMessageValidator = {
    validate: function (value, onError) {

        function validateCallback(_count, _errors) {
            if (_count) {
                for (var i in _errors) {
                    onError(_errors[i].message, _errors[i].parameter, _errors[i].value);
                }
            }
        }

        Validator.run(
            Validator
                .isObject()
                .withRequired('receivers', Validator.isArray(receiverValidator))
                .withRequired('message', Validator.isString())
                .withRequired('sender', receiverValidator),
            value.url.query,
            validateCallback
        );


    }
};


module.exports = {
    /**
     *
     * @param _value
     * @param _validator
     * @returns {{count: number, errors: Array}}
     */
    run: function(_validator, _value) {
        var result = { count: 0, errors: [] };
        Validator.run(_validator, _value, function(_count, _errors) {
            result.count = _count;
            result.errors = _errors;
        });

        return result;
    },

    receiver: receiverValidator,
    socketConnection: socketConnectionValidator,
    httpSendMessage: httpSendMessageValidator
};
