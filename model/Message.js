var Mongoose = require('mongoose');
var Util = require('util');
var mongooseAutoIncrement = require('mongoose-auto-increment');

/**
 *
 * @type {Mongoose.Schema}
 */
var MessageSchema = new Mongoose.Schema({
		id: Number,
		createdAt: { type: Date, default: Date.now },
		sender: String,
		receivers: [String],
		message: String
	});
var MessageModel = Mongoose.model('Message', MessageSchema);
MessageSchema.plugin(mongooseAutoIncrement.plugin, { model: 'Message', field: 'id' });

/**
 * Validators
 */
with (MessageModel.schema) {

    path('sender').validate(function (value) {
            return typeof value == 'string' && /[^\s]+/i.test(value);
        },
        'Sender can not be empty and have to be a string'
    );

    path('receivers').validate(function (value) {
            return Util.isArray(value) && value.length > 0;
        },
        'Receivers must have at least one element'
    );
}

module.exports = MessageModel;