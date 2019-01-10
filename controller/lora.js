var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();

var Lora = require("../model/lora");

router.get('/admin-mon/:hours', function(req, res, next) {
    var hours = req.params.hours;
    var lastHour = new Date();
    lastHour.setHours(lastHour.getHours() - hours);
    Lora.find({ datetime: { $gt: lastHour } }, null, { sort: { datetime: -1 } }, function(err, records) {
        if (err) next(err);
        else {
            let peopleIn = 0, peopleOut = 0;
            records.forEach(function(record) {
                peopleIn += record.sensor.peopleIn;
                peopleOut += record.sensor.peopleOut;
            });

            res.json({
                temperature: records[0].sensor.temperature,
                humidity: records[0].sensor.humidity,
                peopleIn: peopleIn,
                peopleOut: peopleOut
            });
        }
    });
});

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
        datetime: uplink.Time
    }
    let lora = new Lora(data);
    lora.save(function(err) {
        if (err) next(err);
        else {
            wss.clients.forEach(function each(client) {
                client.send(JSON.stringify({type:'lora',results:data}));
            });
            res.json({ results: "Complete" });
        }
    });
});

module.exports = router;