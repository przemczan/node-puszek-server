var Mongoose = require('mongoose');
var mongooseAutoIncrement = require('mongoose-auto-increment');
var Logger = require('./logger').child({ component: 'database' });

/**
 *
 */
function onError(_error) {
    Logger.fatal({ error: _error });
    process.exit(0);
}

/**
 *
 */
function onOpen() {
    Logger.info('Database connected.');
}

/**
 *
 */
module.exports = {

    /**
     *
     * @returns {*}
     */
    getConnection: function () {
        return Mongoose.connection;
    },

    /**
     *
     * @param dbPath
     */
    connect: function(dbPath) {
        Mongoose.connect(dbPath);
        Mongoose.connection.on('error', onError);
        Mongoose.connection.on('open', onOpen);
        mongooseAutoIncrement.initialize(Mongoose.connection);

        return this;
    }
};