var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var path = require("path");
var http = require("http");
var mongoose = require("mongoose");

mongoose.connect('mongodb://tgr:tgr2019@localhost:27017/hwData', { useNewUrlParser: true });

var app = express();
app.use(bodyParser.json());

var httpServer = http.createServer(app);
httpServer.listen(80);