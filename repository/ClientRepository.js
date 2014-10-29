var Client = require('../model/Client');

module.exports = {
    findByName: function(_name, _callback) {
        Client.findOne({ name: _name }, _callback);
    }
};