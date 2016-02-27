/*globals Phaser*/

var permanentStorage = window.localStorage;
var tempStorage = window.sessionStorage;
var peer;
var conns=[];



Phaser.Plugin.ClientPlugin = function (game, parent) {
    Phaser.Plugin.call(this, game, parent);
    if (!game.client) game.client = new Client();

};


Phaser.Plugin.ClientPlugin.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.ClientPlugin.prototype.constructor = Phaser.Plugin.ClientPlugin;


function doPost(endPoint, data, callback) {
    console.log(data);
    fetch('/' + endPoint, {
        credentials: 'same-origin',
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                callback(response.status)
            }

            // Examine the text in the response
            response.json().then(function (data) {
                console.log(data);
                callback(null, data);
            });
        }
    )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
            callback(err);
        });
}



function doGet(endPoint, filter, callback) {

    var qs='';
    qsCount=0;
    if(filter) {
        qs+='?';
        for (var k in filter) {
            qs+=(qsCount++>0 ?'&':'?') + encodeURIComponent(k) + '=' + encodeURIComponent(filter[k]);
        }
    }

    fetch('/' + endPoint, {
        credentials: 'same-origin',
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                callback(response.status)
            }

            // Examine the text in the response
            response.json().then(function (data) {
                console.log(data);
                callback(null, data);
            });
        }
    )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
            callback(err);
        });
}

function handleConnection(conn){

    console.log('connection',conn);
    conns.push(conn);
    conn.on('data', function(data) {
        console.log('Received', data);

    });

}

var Client = function () {

    return {

        doLogin:  function(email, pass, callback) {
            tempStorage.email = email;
            doPost('login', {
                user: email,
                pass: pass,
            }, function (err, user) {
                if (err) return callback(err,user);
                tempStorage.user = user;
                this.getPeerId(callback);
            }.bind(this) );

        },

        getPeerId: function (callback) {
            peer = new Peer({key: 'aeepyvq614zsq0k9'});
            tempStorage.peer = peer;

            peer.on('open', function(id) {
                console.log('My peer ID is: ' + id);
                doPost('setPeer', {
                    peerId: peer.id
                }, callback);
            });

            peer.on('connection', handleConnection);

        },

        createRoom: function (callback) {
            doPost('createRoom',{}, callback);
        },

        getRooms: function (callback) {
            doPost('getRooms',{}, callback);
        },

        joinRoom: function (room, callback) {
            if(!peer) callback('not connected');



            for (var i in room.peers) {

                var conn = peer.connect(room.peers[i].peerId);
                conn.on('open', function() {
                    conns.push(conn);
                    // Receive messages
                    conn.on('data', function(data) {
                        console.log('Received', data);
                    });

                    // Send messages
                    conn.send('Hello!');
                });
            }
            doPost('joinRoom',{"roomId":room.id}, callback);
        }







    }



};