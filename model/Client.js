var Mongoose = require('mongoose');
//var mongooseAutoIncrement = require('mongoose-auto-increment');

/**
 *
 * @type {Mongoose.Schema}
 */
var ClientSchema = new Mongoose.Schema({
		//id: Number,
		createdAt: { type: Date, default: Date.now },
        name: { type: String, unique: true, required: true },
		privateKey: { type: String, required: true }
	}, {
        collection: 'client'
    });
var ClientModel = Mongoose.model('client', ClientSchema);
//ClientSchema.plugin(mongooseAutoIncrement.plugin, { model: 'client', field: 'id' });

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