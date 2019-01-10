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
            if (data.status === "enter") tourists++;
            else if (data.status === "leave" && tourists !== 0) tourists--;

            if (tourists > 2) {
                if (typeof(reply) !== 'undefined') {
                    fetch(reply, {  method: 'POST' })
                    .then(response => response.json())
                    .then(result => console.log(result));
                }
            }
            
            res.json({ results: "Complete" });
        }
    });
});

module.exports = router;