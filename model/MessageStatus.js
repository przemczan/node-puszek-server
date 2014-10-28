var mongoose = require('mongoose');
var mongooseAutoIncrement = require('mongoose-auto-increment');

/**
 *
 * @type {Mongoose.Schema}
 */
var MessageStatusSchema = new mongoose.Schema({
        message: mongoose.Schema.Types.ObjectId,
        receiver: String,
        isRead: { type: Boolean, default: false }
    });

MessageStatusSchema.plugin(mongooseAutoIncrement.plugin, { model: 'MessageStatus', field: 'id' });

module.exports = mongoose.model('MessageStatus', MessageStatusSchema);