'use strict';
/* jshint node:true */

var express     = require('express'),
    path        = require('path'),
    morgan      = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

var app = express();

app.use(bodyParser.json());
app.use(cookieParser('S3Cre7*)0dE'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'dist')));

var routes = require('./server/routes');

app.post('/login', routes.login);


app.listen(8080, function() {
    console.log('Server started on port ' + 8080);
});
