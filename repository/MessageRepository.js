var Message = require('../model/Message');

module.exports = {
    getAllForClient: function(_ws, _callback) {
        var query = Message.find();
        if (_ws.data.subscribe) {
            query.where('receivers').in(_ws.data.subscribe);
        }
        //.where('receivers').lt(_ws.data.date)
        query.exec(_callback);
    }
};