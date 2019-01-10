var express = require('express');
var fs = require("fs");
var csv = require("csv-parser");
var path = require('path');
var router = express.Router();

var Hour = require("../model/Hour");

router.get('/importCSV', function(req, res) {
    var results = [];
    fs.createReadStream(path.join(__dirname, '..', 'csv', 'sanam.csv'))
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        results.forEach(function(result) {
            var dayValues = result["day;values"].split(";");
            var hour = 1;

            for (var i = 1; i < dayValues.length; i++) {
                let date = new Date(dayValues[0]);
                date.setHours(date.getHours() + hour++);

                var data = {
                    date: date,
                    count: dayValues[i]
                }
                new Hour(data).save();

                if (hour == 25) hour = 1;
            }
        });
        res.json({ result: "Complete" });
    });
});

router.get('/last-hours', function(req, res, next) {
    var hours = req.query.hours;
    Hour.count({}, function(err, count) {
        if (err) {
            next(err);
        } else {
            if (hours <= count) {
                Hour.find(null, null, {sort: {date: -1}, limit: parseInt(hours) }, function(err, records) {
                    if (err) next(err);
                    else res.json({
                        number_of_tourist: records.map(function(record) { return record.count })
                    });
                });
            } else {
                next(new Error("Number of previous hour in record is not enough"));
            }
        }
    });
});


module.exports = router;