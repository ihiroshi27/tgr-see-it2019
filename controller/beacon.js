var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();

var Beacon = require("../model/beacon");
var Hour = require('../model/hour');

var cron = require('cron');
var cronJob = cron.job("0 0 * * * *", function(){
    let date = new Date();

    var lastHour = new Date(date);
    lastHour.setHours(lastHour.getHours() - 1);

    Beacon.find({ status: 'enter', datetime: { $gt: lastHour } }, function(err, records) {
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        var data = {
            date: date,
            count: records.length
        }
        var hour = new Hour(data);
        hour.save(function(err) {
            if (err) console.log(err)
            else console.info('[Beacon] cronJob completed', date);
        });
    });
}); 
cronJob.start();

var tourists = 0;

router.post('/', function(req, res, next) {
    let data = req.body;
    let reply = data.reply;
    delete(data.reply);

    let beacon = new Beacon(data);
    beacon.save(function(err) {
        if (err) {
            next(err);
        } else {
            if (data.status === "enter") {
                tourists++;

                if (tourists > 2) {
                    if (typeof(reply) !== 'undefined') {
                        fetch(reply, {  method: 'POST' })
                        .then(response => response.json())
                        .then(json => {
                            console.log("[Beacon] POST", reply, JSON.stringify(json));
                        });
                    }
                }
            } 
            else if (data.status === "leave" && tourists !== 0) tourists--;
            console.log("[Beacon] Current tourists", tourists);

            res.json({ results: "Complete" });
        }
    });
});

module.exports = router;