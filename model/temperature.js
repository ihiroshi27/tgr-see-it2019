var mongoose = require('mongoose');

var schema = mongoose.Schema({ 
    teamID: String,
    temp: Number
});

module.exports = mongoose.model('temperature', schema);