
var SinglePlayer = function () {

};

SinglePlayer.prototype = {

    preload: function () {
        this.stage.backgroundColor = '#b1d256';
        this.load.image('logo', 'assets/logo.png');
    },

    create: function () {

        var halfWidth = this.game.width/ 2,
            halfHeight = this.game.height/ 2;

        this.mainGroup = this.add.group();
        this.logo = this.add.image(halfWidth, 300, 'logo');
        this.logo.anchor.setTo(0.5, 0.5);



        this.button_ClickCluck = this.add.button(halfWidth, halfHeight + 50, 'Click Cluck', 64, this.mainGroup);
        this.button_ClickCluck.customEvents.animComplete.add(function () {
            this.state.start('Mini_ClickTap');
        }, this);
        this.game.add.tween(this.button_ClickCluck).from( { y: -200,  }, 800, Phaser.Easing.Elastic.Out, true);



        this.button_SpriteShoot = this.add.button(halfWidth, halfHeight + 50 + (128), 'Sprite Shoot', 64, this.mainGroup);
        this.button_SpriteShoot.customEvents.animComplete.add(function () {
            // this.state.start('Minis_SpriteShoot');
        }, this);
        this.game.add.tween(this.button_SpriteShoot).from( { y: -200,  }, 800, Phaser.Easing.Elastic.Out, true);



        this.button_Back = this.add.button(halfWidth, this.game.height - 100, 'Back', 48, this.mainGroup);
        this.button_Back.customEvents.animComplete.add(function () {
            this.state.start('Menu_MainMenu');
        }, this);
        this.game.add.tween(this.button_Back).from( { y: -200,  }, 800, Phaser.Easing.Elastic.Out, true);

    }
};

module.exports = SinglePlayer;