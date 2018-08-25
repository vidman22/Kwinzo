var env = process.env.NODE_ENV || 'development',
    config = require('./config')[env],
    mongoose = require('mongoose');

module.exports = function () {
    mongoose.Promise = global.Promise;
    var db = mongoose.connect(config.db);
    mongoose.connection.on('error', console.error.bind(console, 'connection error'));
    mongoose.connection.on('open', function() {
        console.log("mongo connected!");
    })
    return db;
};