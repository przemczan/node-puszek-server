var Validator = require("node-validator");

var receiverValidator = Validator.isString({ regex: /.+/i });

var socketUrlQueryValidator = Validator
    .isObject()
    .withRequired('receiver', receiverValidator)
    .withRequired('subscribe', Validator.isArray(receiverValidator));

var httpSendMessageValidator = (function () {

        return {
            validate: validate
        };

        /**
         *
         * @param value
         * @param onError
         * @returns {*}
         */
        function validate(value, onError) {

            /**
             *
             * @param _count
             * @param _errors
             */
            function validateCallback(_count, _errors) {
                if (_count) {
                    for (var i in _errors) {
                        onError(_errors[i].message, _errors[i].parameter, _errors[i].value);
                    }
                }
            }

            /**
             * url.query:
             *      receivers       required
             *      message:        required
             *      sender:         required
             */
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
    })();


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
    socketUrlQuery: socketUrlQueryValidator,
    httpSendMessage: httpSendMessageValidator
};
