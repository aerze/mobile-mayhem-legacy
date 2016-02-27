
var Db = require('./db');
var Room = require('./room');
var usersOnline = {};
var roomsOnline = {};
var maxRoomId = 0;


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
    //if (req.signedCookies !== undefined && req.signedCookies.username !== undefined) return res.sendStatus(200);  //if cached login
    if (req.body.user === undefined || req.body.pass === undefined) return res.sendStatus(400);  //no data

    var name = req.body.user;
    var pass = req.body.pass;

    Db.getUser(name,pass,processLogin.bind({res:res}));

};


exports.logout = function(req, res) {
    if (req.signedCookies !== undefined && req.signedCookies.username !== undefined)
    //TODO: room cleanup
    if(usersOnline[req.signedCookies.username]) delete usersOnline[req.signedCookies.username];
    res.json({"msg":"goodbye"});
};


exports.createRoom = function(req, res) {
    console.log(req.signedCookies);
    console.log("create", req.body);
    if (req.signedCookies !== undefined && req.signedCookies.username !== undefined)
        if(usersOnline[req.signedCookies.username]) {
            var user = usersOnline[req.signedCookies.username];

            var id = maxRoomId++;
            roomsOnline[id]=Room.createRoom(user,id);
            console.log('rooms',roomsOnline);

        }
    //TODO: else lookup user

    res.json({"msg":"roomCreated", "data":roomsOnline[id] });
};

exports.getRooms = function(req, res) {
    console.log(req.signedCookies);
    console.log("get", req.body);
    if (req.signedCookies !== undefined && req.signedCookies.username !== undefined) {
        //if(usersOnline[req.signedCookies.username]) {
        //    var user =  usersOnline[req.signedCookies.username];
        //
        //}

        var rooms = [];
        console.log('rooms', rooms);
        console.log('roomsOnline', roomsOnline);

        for (var id in roomsOnline) {
            var room = roomsOnline[id];
            console.log('room', room);
            if (room.peers.length < 4) rooms.push(room);
            if (rooms.length > 2) break;
        }

        console.log('roomList', rooms);
    }
    res.json({"msg":"roomList", "data":(rooms||[]) });
};

exports.joinRoom = function(req, res) {
    console.log(req.signedCookies);
    console.log("join", req.body);
    if (req.signedCookies !== undefined && req.signedCookies.username !== undefined)
        if(usersOnline[req.signedCookies.username]) {
            var user =  usersOnline[req.signedCookies.username];
            var roomId = req.body.roomId;
            roomsOnline[roomId].peers.push({user:user.username, peerId:user.peerId})
        }

    res.json({"msg":"roomJoined"});
};


exports.setPeerId = function(req, res) {
    console.log(req.signedCookies);
    console.log("peer", req.body);
    if (req.signedCookies !== undefined && req.signedCookies.username !== undefined)
        if(usersOnline[req.signedCookies.username]) {
            var user = usersOnline[req.signedCookies.username];
            console.log("peer", req.body.peerId);
            if(req.body.peerId) {
                user.peerId=req.body.peerId;
                console.log(user);
            }
            else return res.status(400).send("No Data");
        }
    res.json({"msg":"peerSet"});
};


