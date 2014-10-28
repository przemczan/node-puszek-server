var mongoose = require('mongoose');
var mongooseAutoIncrement = require('mongoose-auto-increment');

var connection;

/**
 *
 */
module.exports = {

    /**
     *
     * @returns {*}
     */
    getConnection: function () {
        return connection;
    },

    /**
     *
     * @param dbPath
     */
    connect: function(dbPath) {
        connection = mongoose.connect(dbPath);
        mongooseAutoIncrement.initialize(connection);

        return this;
    }
};