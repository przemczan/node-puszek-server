var Mongoose = require('mongoose');
var mongooseAutoIncrement = require('mongoose-auto-increment');

/**
 *
 * @type {Mongoose.Schema}
 */
var ClientSchema = new Mongoose.Schema({
		id: Number,
		createdAt: { type: Date, default: Date.now },
        name: { type: String, unique: true },
		privateKey: String
	});
var ClientModel = Mongoose.model('Client', ClientSchema);
ClientSchema.plugin(mongooseAutoIncrement.plugin, { model: 'Client', field: 'id' });

/**
 * Validators
 */
with (ClientModel.schema) {

    path('name').validate(function (value) {
            return typeof value == 'string' && /[^\s]+/i.test(value);
        },
        'Name is required'
    );

    path('privateKey').validate(function (value) {
            return typeof value == 'string' && /[^\s]+/i.test(value);
        },
        'Private key is required'
    );
}

module.exports = ClientModel;