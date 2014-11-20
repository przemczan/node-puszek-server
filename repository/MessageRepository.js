var Model = require('../model');
var Mongoose = require('mongoose');

module.exports = {
    /**
     *
     * @param _ws
     * @param _callback
     * @returns {Promise}
     */
    getAllForUser: function(_ws, _callback) {
        Model.Message
            .find(
                {
                    client: _ws.data.client._id,
                    receivers: { $in: _ws.data.query.subscribe },
                    read_by: { $nin: [_ws.data.query.receiver] }
                },
                { '_id': true, 'createdAt': true, 'message': true, 'sender': true, 'receivers': true }
            )
            .exec(_callback);
    },

    /**
     *
     * @param _ws
     * @param _messagesIds
     * @param _callback
     */
    markAsRead: function(_ws, _messagesIds, _callback) {
        Model.Message
            .update(
                {
                    client: _ws.data.client._id,
                    _id: { $in: _messagesIds },
                    read_by: { $nin: [_ws.data.query.receiver] }
                },
                {
                    $push: { read_by: _ws.data.query.receiver }
                },
                { multi: true }
            )
            .exec(_callback);
    }
};
