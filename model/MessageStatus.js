var Mongoose = require('mongoose');
var Client = require('./Client');
//var mongooseAutoIncrement = require('mongoose-auto-increment');

/**
 *
 * @type {Mongoose.Schema}
 */
var MessageStatusSchema = new Mongoose.Schema({
        //id: Number,
        client: { type: Mongoose.Schema.ObjectId, required: true, ref: 'messages' },
        receiver: String,
        isRead: { type: Boolean, default: false }
    }, {
        collection: 'message_status'
    });
var MessageStatusModel = Mongoose.model('message_status', MessageStatusSchema);
//MessageStatusSchema.plugin(mongooseAutoIncrement.plugin, { model: 'message_status', field: 'id' });

module.exports = MessageStatusModel;