





exports.createRoom = function (user, id) {

    var room = {};
    room.id = id;
    room.owner = user.username;
    room.peers = [];
    room.peers.push({user:user.username, peerId:user.peerId});
    room.created=new Date();

    return room;

};




