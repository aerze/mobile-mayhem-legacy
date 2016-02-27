
var RoomMenu = function () {

};




RoomMenu.prototype = {
    
    roomList: [],

    preload: function () {

        this.stage.backgroundColor = '#b1d256';
        this.load.image('logo', 'assets/logo2.png');

        
        
    },

    create: function () {


        var self = this;
        var halfWidth = this.game.width/ 2,
            halfHeight = this.game.height/ 2;

        this.mainGroup = this.add.group();
        this.logo = this.add.image(halfWidth, 300, 'logo');
        this.logo.anchor.setTo(0.5, 0.5);

        this.button_CreateRoom = this.add.button(halfWidth, this.game.height - 500, 'Create Room', 48, this.mainGroup);
        this.button_CreateRoom.customEvents.animComplete.add(function () {
                this.game.client.createRoom(function (err, res) {
                    if (err ) {
                        alert('Create Failed:' + (err.msg || 'Unknown Issue'));
                    }
                    else {
                        self.game.state.start('Menu_SinglePlayer');
                    }
                })
        }, this);
        this.game.add.tween(this.button_CreateRoom).from( { y: -400  }, 800, Phaser.Easing.Elastic.Out, true);


        this.game.client.getRooms(function handleRooms(err, res) {

            if(!err) {
                console.log('roomlist',res);
                self.roomList=res.data;
            }

        
        
            for (var x=0; x< self.roomList.length;x++) {
                var room=self.roomList[x];
    
                self['button_Room'+room.id] = self.add.button(halfWidth, self.game.height - 400 + x*100, 'Join Room', 48, self.mainGroup);
                self['button_Room'+room.id].room=room;
                self['button_Room'+room.id].customEvents.animComplete.add(function () {
    
    
                    self.game.client.joinRoom(this.room, function (err, res) {
                        if (err) {
                            alert('Join Failed:' + (err.msg || 'Unknown Issue'));
                        }
                        else {
                            self.game.state.start('Menu_SinglePlayer');
                        }
    
                    })
    
    
                }, self['button_Room'+room.id]);
                self.game.add.tween(self['button_Room'+room.id]).from({y: -400,}, 800, Phaser.Easing.Elastic.Out, true);
    
            }

        });    
            
        this.button_Back = this.add.button(halfWidth, this.game.height - 100, 'Back', 48, this.mainGroup);
        this.button_Back.customEvents.animComplete.add(function () {

            this.state.start('Menu_Multiplayer');
        }, this);
        this.game.add.tween(this.button_Back).from( { y: -200,  }, 800, Phaser.Easing.Elastic.Out, true);

    }
};



module.exports = RoomMenu;