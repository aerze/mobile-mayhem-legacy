'use strict';
/* jshint node:true */

var express     = require('express'),
    path        = require('path'),
    morgan      = require('morgan'),
    PeerServer = require('peer').PeerServer;

var peerServer = PeerServer({port: 9000, path: '/peerjs'});
var app = express();

app.use(morgan('dev'));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.static(path.join(__dirname, 'dist')));

var server = require('http').createServer(app);


peerServer.on('connection', function (id) {
  console.log(id, 'conecto');
});

peerServer.on('disconnect', function(id) {
  console.log(id, 'desconecto');
});

server.listen(8000);
