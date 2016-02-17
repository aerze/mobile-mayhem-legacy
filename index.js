'use strict';
/* jshint node:true */

var express     = require('express'),
    path        = require('path'),
    morgan      = require('morgan');

var app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(8080, function() {
    console.log('Server started on port ' + 8080);
});
