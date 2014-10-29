var Bunyan = require('bunyan');
var Config = require('../config');

module.exports = Bunyan.createLogger({
    name: 'puszek',
    streams: [
        {
            level: 'info',
            stream: process.stdout
        },
        {
            type: 'rotating-file',
            period: '1d',               // daily rotation
            count: 3,                   // keep 3 back copies
            level: 'error',
            path: Config.logs.filePath
        }
    ]
});
