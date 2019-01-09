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
    var data = req.body;
    var temperature = new Temperature(data);
    temperature.save(function(err) {
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

var httpServer = http.createServer(app);
httpServer.listen(80);