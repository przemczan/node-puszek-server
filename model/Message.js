var mongoose = require('mongoose');
var mongooseAutoIncrement = require('mongoose-auto-increment');

/**
 *
 * @type {Mongoose.Schema}
 */
var MessageSchema = new mongoose.Schema({
		id: Number,
		createdAt: { type: Date, default: Date.now },
		sender: String,
		receivers: [String],
		message: String
	});

MessageSchema.plugin(mongooseAutoIncrement.plugin, { model: 'Message', field: 'id' });

module.exports = mongoose.model('Message', MessageSchema);