
var db = require('./db');
var usersOnline = {};
var roomsOnline = {};


function processLogin(err, user) {
    if (err) {
        console.log('login err ' + err);
        return this.res.sendStatus(401);
    }

    this.res.cookie('username', user.username, { signed: true, path:'/' });
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


exports.logout = function(req, res) {
    if (req.signedCookies !== undefined && req.signedCookies.user !== undefined)
    //TODO: room cleanup
    if(usersOnline[req.signedCookies.user]) delete usersOnline[req.signedCookies.user];
    res.json({"msg":"goodbye"});
};


exports.createRoom = function(req, res) {
    if (req.signedCookies !== undefined && req.signedCookies.user !== undefined)
    if(usersOnline[req.signedCookies.user]) {
        var user =  usersOnline[req.signedCookies.user];

    }

    res.json({"msg":"roomCreated"});
};

exports.getRooms = function(req, res) {
    if (req.signedCookies !== undefined && req.signedCookies.user !== undefined)
        if(usersOnline[req.signedCookies.user]) {
            var user =  usersOnline[req.signedCookies.user];

        }

    res.json({"msg":"goodbye"});
};


exports.setPeerId = function(req, res) {
    if (req.signedCookies !== undefined && req.signedCookies.user !== undefined)
        if(usersOnline[req.signedCookies.user]) {
            var user = usersOnline[req.signedCookies.user];
            if(req.body.peerId) user.peerId=req.body.peerId;
            else return res.status(400).send("No Data");
        }
    res.json({"msg":"peerSet"});
};


