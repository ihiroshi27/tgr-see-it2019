var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var path = require("path");
var http = require("http");
var mongoose = require("mongoose");

mongoose.connect('mongodb://tgr:tgr2019@localhost:27017/hwData', { useNewUrlParser: true });

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
        let id = jsonCount + 1;
        user.id = id;
        json['user' + id] = user;
        res.json(json);
    });
});

app.post('/addMultiUser', function(req, res) {
    var users = req.body.users;
    fs.readFile(path.join(__dirname, "users.json"), 'utf8', function(err, data) {
        let json = JSON.parse(data);
        let jsonCount = Object.keys(json).length;
        
        jsonCount++;
        for(var i in users) {
            let id = jsonCount++;
            users[i].id = id;
            json['user' + id] = users[i];
        }
        res.json(json);
    });
});

app.delete('/deleteUser/:id', function(req, res) {
    var id = req.params.id;
    fs.readFile(path.join(__dirname, "users.json"), 'utf8', function(err, data) {
        let json = JSON.parse(data);
        delete(json['user' + id]);
        res.json(json);
    });
});

var httpServer = http.createServer(app);
httpServer.listen(80);