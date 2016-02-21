'use strict';
/* jshint node:true */

var express     = require('express'),
    path        = require('path'),
    morgan      = require('morgan'),
    bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/login', function (req, res) {
    console.log(req.body)
    res.json({"res":"hi"});
});


app.listen(8080, function() {
    console.log('Server started on port ' + 8080);
});
