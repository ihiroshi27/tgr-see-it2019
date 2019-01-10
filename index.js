var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var http = require("http");
var mongoose = require("mongoose");
var WebSocket = require("ws");

mongoose.connect('mongodb://tgr:tgr2019@localhost:27017/seeit', { useNewUrlParser: true });

var app = express();
app.enable('trust proxy');

app.use('/static', express.static('public'))
app.use(bodyParser.json());

app.use('/ml', require('./controller/ml'));
app.use('/beacon', require('./controller/beacon'));
app.use('/lora', require('./controller/lora'));

app.use('/dashboard', express.static(path.join(__dirname, 'view', 'build')))
app.get('dashboard/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'view', 'build', 'index.html'));
});

var httpServer = http.createServer(app);
httpServer.listen(80);

global.wss = new WebSocket.Server({ port: 8080 });

var Lora = require('./model/lora');
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        Lora.find(null, null, { sort: { datetime: -1 }, limit: 1 }, function(err, records) {
            console.log(records);
            if (err) {
                console.log(err);
            } else {
                ws.send(JSON.stringify(records[0]));
            }
        });
    });
   
    // setInterval(function() {
    //     Lora.find({}, null, { sort: { datetime: -1 }, limit: 1 }, function(err, records) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             ws.send(JSON.stringify(records[0]));
    //         }
    //     });
    // }, 30000);
});