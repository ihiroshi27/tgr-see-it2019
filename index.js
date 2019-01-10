var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var http = require("http");
var mongoose = require("mongoose");

mongoose.connect('mongodb://tgr:tgr2019@localhost:27017/seeit', { useNewUrlParser: true });

var app = express();
app.enable('trust proxy');

app.use('/static', express.static('public'))
app.use(bodyParser.json());

app.use('/ml', require('./controller/ml'));
app.use('/beacon', require('./controller/beacon'));
app.use('/lora', require('./controller/lora'));

var httpServer = http.createServer(app);
httpServer.listen(80);