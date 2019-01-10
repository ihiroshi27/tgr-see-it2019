var mongoose = require('mongoose');

var schema = mongoose.Schema({ 
    DevEUI: { type: String, required: true },
    DevAddr: { type: String, required: true },
    sensor: {
        temperature: { type: Number, required: true },
        humidity: { type: Number, required: true },
        peopleIn: { type: Number, required: true },
        peopleOut: { type: Number, required: true }
    },
    datetime: { type: Date, required: true }
});

module.exports = mongoose.model('lora', schema);