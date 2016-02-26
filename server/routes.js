
var db = require('./db');
var usersOnline = {};


function processLogin(err, user) {
    if (err) {
        console.log('login err ' + err);
        return this.res.sendStatus(401);
    }

    //this.res.cookie('username', user.username, { signed: true, path:'/' });
    usersOnline[user.username]=user;
    var _user = JSON.parse(JSON.stringify(user));
    delete _user.password;
    this.res.json(_user);

}

exports.login = function(req, res) {
    //if (req.signedCookies !== undefined && req.signedCookies.user !== undefined) return res.sendStatus(200);  //if cached login
    if (req.body.user === undefined || req.body.pass === undefined) return res.sendStatus(400);  //no data

    var name = req.body.user;
    var pass = req.body.pass;

    db.getUser(name,pass,processLogin.bind({res:res}));

};



