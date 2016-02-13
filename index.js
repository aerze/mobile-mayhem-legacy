'use strict';
/* jshint node:true */

require('dotenv').load();

var express     = require('express'),
    path        = require('path'),
    morgan      = require('morgan');

var app = express();

// if (process.env.DEV) {

//     // compiles stylus files to css on the fly
//     app.use(stylus.middleware({

//         src: path.join(__dirname, '/../../client/'),
//         dest: path.join(__dirname, '/../../dist/'),
//         compress: true,
//         serve: true

//     }));

//     // webpack files on the fly too
//     var webpackCompiler = webpack({

//         context: path.join(__dirname, '/../../client'),
//         entry: './index.js',
//         output: {
//             path: __dirname + '../dist',
//             filename: 'bundle.min.js'
//         },
//         plugins: [
//             new webpack.optimize.UglifyJsPlugin({minimize: true}),
//             new webpack.optimize.DedupePlugin(),
//             new webpack.optimize.OccurenceOrderPlugin(true)
//         ]
//     });

    // app.use(function(req, res, next) {

    //     webpackCompiler.run(function (err, stats) {

    //         if (err) console.log(err);
    //         // console.log(stats);
    //         next();

    //     });

    // });
// }


app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(8080, function() {
    console.log('Server started on port ' + 8080);
});
