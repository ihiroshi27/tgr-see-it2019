var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var path = require("path");
var http = require("http");
var csv = require("csv-parser");
var mongoose = require("mongoose");

mongoose.connect('mongodb://tgr:tgr2019@localhost:27017/seeit', { useNewUrlParser: true });

var app = express();
app.use(bodyParser.json());

var Hour = require('./model/hour');

app.get('/csv', function(req, res) {
    var results = [];
    fs.createReadStream(path.join(__dirname, 'csv', 'sanam.csv'))
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

app.get('/sanam/:hour', function(req, res, next) {
    var hours = req.params.hour;
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
                next(new Error("Number of previous hour in record is not enought"));
            }
        }
    });
});

var httpServer = http.createServer(app);
httpServer.listen(80);