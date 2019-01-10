var express = require('express');
var fs = require("fs");
var csv = require("csv-parser");
var path = require('path');
var router = express.Router();
var tf = require("@tensorflow/tfjs");
require('@tensorflow/tfjs-node');

var Hour = require("../model/hour");

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

const sequenceLen = 10
const normalize_value = 1800
var model
async function loadModelTF() {
    model = await tf.loadModel('file://tf_model/model.json');
    console.log("loaded");
}
loadModelTF()

router.get("/predict", function(req, res, next) {
    Hour.find(null, null, {sort: { date: -1 }, limit: 10 }, function(err, records) {
        if (err) next(err);
        else {
            let tourists = records.map(function(record) { return record.count });
            let data = [];
            tourists.reverse().forEach(function(item) {
                data.push(item/normalize_value)
            })
            let predictData = tf.reshape(tf.tensor2d([data]), [-1,sequenceLen,1])
            const r = model.predict(predictData);
            let predictResult = r.dataSync();
            let result = []
            let i = 0
            for (i = 0; i < predictResult.length; i++) {
                result.push(Math.round(predictResult[i] * normalize_value)) 
            }
            res.json({ "number_of_tourist": result })
        }
    });
})

router.post("/predict", function(req, res) {
    let data = req.body.list
    let newdata = []
    let i = 0
    for (i = 0; i < data.length; i++) {
        newdata.push(data[i]/normalize_value)
    }
    data = newdata
    console.log(data)
    let predictData = tf.reshape(tf.tensor2d([data]), [-1,sequenceLen,1])
    const r = model.predict(predictData);
	let predictResult = r.dataSync();
	let result = []
	for (i = 0; i < predictResult.length; i++) {
		result.push(Math.round(predictResult[i] * normalize_value)) 
	}
	res.json({ "number_of_tourist": result })
})

module.exports = router;