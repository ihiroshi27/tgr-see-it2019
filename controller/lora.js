var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();

var Lora = require("../model/lora");

router.post('/', function(req, res, next) {
    let uplink = req.body.DevEUI_uplink;
    let frames = uplink.payload_parsed.frames;

    let data = {
        DevEUI: uplink.DevEUI,
        DevAddr: uplink.DevAddr,
        sensor: {
            temperature: frames[0].value,
            humidity: frames[1].value,
            peopleIn: frames[2].value,
            peopleOut: frames[3].value
        },
        datetime: uplink.time
    }
    let lora = new Lora(data);
    lora.save(function(err) {
        if (err) next(err);
        else res.json({ results: "Complete" });
    });
});

module.exports = router;