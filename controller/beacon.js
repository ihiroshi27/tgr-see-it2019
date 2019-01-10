var express = require('express');
var router = express.Router();

var Beacon = require("../model/beacon");

var tourists = 0;

router.post('/', function(req, res, next) {
    let data = req.body;
    let beacon = new Beacon(data);
    beacon.save(function(err) {
        if (err) {
            next(err);
        } else {
            if (data.status === "enter") tourists++;
            else if (data.status === "leave" && tourists !== 0) tourists--;

            res.json({ results: "Complete" });
            console.log(tourists);
        }
    });
});

module.exports = router;