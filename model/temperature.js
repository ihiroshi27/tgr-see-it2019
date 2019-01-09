var mongoose = require('mongoose');

var schema = mongoose.Schema({ 
    teamID: String,
    temp: Double
});

module.exports = mongoose.model('temperature', schema);