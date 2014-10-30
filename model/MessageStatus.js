var Mongoose = require('mongoose');
var mongooseAutoIncrement = require('mongoose-auto-increment');

/**
 *
 * @type {Mongoose.Schema}
 */
var MessageStatusSchema = new Mongoose.Schema({
        id: Number,
        message: Mongoose.Schema.Types.ObjectId,
        receiver: String,
        isRead: { type: Boolean, default: false }
    });
var MessageStatusModel = Mongoose.model('MessageStatus', MessageStatusSchema);
MessageStatusSchema.plugin(mongooseAutoIncrement.plugin, { model: 'MessageStatus', field: 'id' });

module.exports = MessageStatusModel;