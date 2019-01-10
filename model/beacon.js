var mongoose = require('mongoose');

var schema = mongoose.Schema({ 
    datetime: { type: Date, required: true },
    status: { type: String, required: true }
});

module.exports = mongoose.model('beacon', schema);