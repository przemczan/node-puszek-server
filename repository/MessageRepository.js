var Message = require('../model/Message');
var Mongoose = require('mongoose');

module.exports = {
    getAllForUser: function(_ws, _callback) {
        var query = Message.find();
        if (_ws.data.subscribe) {
            query.where('receivers').in(_ws.data.subscribe);
        }
        query.where('client').equals(Mongoose.Types.ObjectId(_ws.data.client._id));
        query.exec(_callback);
    }
};