var Message = require('../model/Message');
var Mongoose = require('mongoose');

module.exports = {
    getAllForUser: function(_ws, _callback) {
        return Message.find()
            .where('receivers').in(_ws.data.subscribe)
            .where('client').equals(Mongoose.Types.ObjectId(_ws.data.client._id))
            .exec(_callback);
    }
};