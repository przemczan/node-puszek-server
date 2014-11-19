module.exports = {
    mongo: {
        uri: 'mongodb://localhost/puszek',
        debug: true
    },
    httpServer: {
        port: 5001,
        headersPrefix: 'puszek-'
    },
    wsServer: {
        port: 5000
    },
    logs: {
        filePath: './logs/logs.log'
    }
};
