
var MainMenu = function () {

};

MainMenu.prototype = {

    preload: function () {
        this.stage.backgroundColor = '#b1d256';
        this.load.image('logo', 'assets/logo2.png');
    },

    create: function () {
        // this.game.firebase.createRoom('test');
        // this.game.firebase.events.onRoomChange.add(function (err, room) {
        //     console.log('Phaser: Signal Recieved');
        //     console.log(room.name);
        // });

        var halfWidth = this.game.width/ 2,
            halfHeight = this.game.height/ 2;

        this.mainGroup = this.add.group();
        this.logo = this.add.sprite(halfWidth, 300, 'logo');
        this.logo.anchor.setTo(0.5, 0.5);
        this.mainGroup.add(this.logo, true);



        this.button_Multiplayer = this.add.button(halfWidth, halfHeight + 50, 'Multiplayer', 64, this.mainGroup);
        this.button_Multiplayer.customEvents.animComplete.add(function () {
            this.state.start('Mini_WhiteTile');
        }, this);



        this.button_SinglePlayer = this.add.button(halfWidth, halfHeight + 50 + (128), 'Single Player', 64, this.mainGroup);
        this.button_SinglePlayer.customEvents.animComplete.add(function () {
                this.state.start('Menu_SinglePlayer');
        }, this);



        this.button_Settings = this.add.button(halfWidth, halfHeight + 50 + (2*128), 'Settings', 64, this.mainGroup);
        this.button_Settings.customEvents.animComplete.add(function () {
            // this.state.start('Menu_createRoom');
        }, this);



        // if (Cocoon.Device.DeviceInfo.os) {
            this.button_QuitGame = this.add.button(halfWidth, halfHeight + 50 + (3 *128), 'Quit', 64, this.mainGroup);
            this.button_QuitGame.customEvents.animComplete.add(function () {
                    // Cocoon.App.exit();
            }, this);

            // this.game.add.tween(this.button_QuitGame).to( { alpha:1 }, 800, Phaser.Easing.Quadratic.In, true, 200);
            this.game.add.tween(this.button_QuitGame).from( { y: -200,  }, 950, Phaser.Easing.Elastic.Out, true);
        // }

        this.game.add.tween(this.button_Multiplayer).from( { y: -200,  }, 800, Phaser.Easing.Elastic.Out, true);
        this.game.add.tween(this.button_SinglePlayer).from( { y: -200,  }, 900, Phaser.Easing.Elastic.Out, true);
        this.game.add.tween(this.button_Settings).from( { y: -200,   }, 850, Phaser.Easing.Elastic.Out, true);

    }
};

module.exports = MainMenu;
