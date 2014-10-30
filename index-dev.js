require('./index.js');

var Model = require("./model");
var Repository = require("./repository");
var Logger = require("./lib/logger").child({ env: 'dev' });

Model.Client.update({ name: 'przemczan' }, { $set: {
    name: 'przemczan',
    privateKey: 'key'
}});