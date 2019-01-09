var mongoose = require('mongoose');

var schema = mongoose.Schema({ 
    teamID: { type: Number, required: true },
    temp: { type: Number, required: true }
});

module.exports = mongoose.model('temperature', schema);