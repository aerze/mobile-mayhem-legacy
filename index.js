'use strict';
/* jshint node:true */

require('dotenv').load();

var express     = require('express'),
    path        = require('path'),
    morgan      = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

var app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIESECRET));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'dist')));

var routes = require('./server/routes');

app.post('/login', routes.login);
app.post('/setPeer', routes.setPeerId);
app.post('/createRoom', routes.createRoom);
app.post('/getRooms', routes.getRooms);
app.post('/joinRoom', routes.joinRoom);


app.listen(process.env.PORT, process.env.IP, function() {

});
