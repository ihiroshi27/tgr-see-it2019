var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var path = require("path");
var http = require("http");
var mongoose = require("mongoose");

mongoose.connect('mongodb://tgr:tgr2019@localhost:27017/hwData', { useNewUrlParser: true });

var app = express();
app.use(bodyParser.json());

var Temperature = require('./model/temperature');

app.post('/receiveData', function(req, res, next) {
    var frames = req.body.DevEUI_uplink.payload_parsed.frames;
    let data = {};
    frames.forEach(function(frame) {
        if (frame.typeString == "Analog Input") {
            data.teamID = frame.value;
        }
        if (frame.typeString == "Temperature Sensor") {
            data.temp = frame.value;
        }
    });

    Temperature.findOneAndUpdate({ teamID: data.teamID }, data, { upsert: true }, function(err) {
        if (err) next(err);
        else res.json({ "results": "Complete" });
    });
});

app.get('/showData', function(req, res, next) {
    Temperature.find(null, function(err, record) {
        if (err) next(err);
        else res.json({ results: record });
    });
});

app.post('/addData', function(req, res, next) {
    var data = req.body;
    Temperature.findOneAndUpdate({ teamID: data.teamID }, data, { upsert: true }, function(err) {
        if (err) next(err);
        else res.json({ "results": "Complete" });
    });
});

app.put('/editData/:teamID', function(req, res, next) {
    var teamID = req.params.teamID;
    var temp = req.body.temp;
    Temperature.updateOne({ teamID: teamID }, { $set: { temp: temp } }, function(err) {
        if (err) next(err);
        else res.json({ "results": "Complete" });
    });
});

app.delete('/deleteData/:teamID', function(req, res, next) {
    var teamID = req.params.teamID;
    Temperature.deleteOne({ teamID: teamID }, function(err) {
        if (err) next(err);
        else res.json({ "results": "Complete" });
    });
});

var httpServer = http.createServer(app);
httpServer.listen(80);