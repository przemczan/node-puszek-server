var Mongoose = require('mongoose');
var mongooseAutoIncrement = require('mongoose-auto-increment');

/**
 *
 */
function onError(_error) {
    console.log('Error connecting database:', _error);
    process.exit(0);
}

/**
 *
 */
function onOpen() {
    console.log('Database connected.');
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