var mongoose = require('mongoose');

var schema = mongoose.Schema({ 
    date: { type: Date, required: true },
    count: { type: Number, required: true }
});

module.exports = mongoose.model('hour', schema);