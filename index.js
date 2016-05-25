'use strict';
/* jshint node:true */

var express     = require('express'),
    path        = require('path'),
    morgan      = require('morgan'),
    ExpressPeerServer  = require('peer').ExpressPeerServer;

var app = express();

app.use(morgan('dev'));
app.use(function(req, res, next) {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();

});
app.use(express.static(path.join(__dirname, 'dist')));

var server = require('http').createServer(app);

app.use('/peerjs', ExpressPeerServer(server, { debug: true }));


server.on('connection', function (socket, id) {
  console.log(id, 'conecto');
});

server.on('disconnect', function(id) {
  console.log(id, 'desconecto');
});

server.listen(9000);
