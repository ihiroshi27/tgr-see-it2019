var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();

var Beacon = require("../model/beacon");

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