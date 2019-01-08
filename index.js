var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var path = require("path");

var app = express();
app.use(bodyParser.json());

app.get('/listUsers', function(req, res) {
    fs.readFile(path.join(__dirname, "users.json"), 'utf8', function(err, data) {
        let json = JSON.parse(data);
        res.json(json);
    });
});

app.get('/showbyID/:id', function(req, res) {
    var id = req.params.id;
    fs.readFile(path.join(__dirname, "users.json"), 'utf8', function(err, data) {
        let json = JSON.parse(data);
        res.json(json['user' + id]);
    });
});

app.post('/addUser', function(req, res) {
    var user = req.body;
    fs.readFile(path.join(__dirname, "users.json"), 'utf8', function(err, data) {
        let json = JSON.parse(data);
        let jsonCount = Object.keys(json).length;
        json['user' + (jsonCount + 1)] = user;
        res.json(json);
    });
});

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App listening at http://%s:%s", host, port)
 })