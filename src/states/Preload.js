
var Preload = function () {

};

Preload.prototype = {

    init: function () {
        this.scale.onOrientationChange.add(function (scale, prevOrientation, wasIncorrect) {
            console.log(scale, prevOrientation, wasIncorrect);
            if (wasIncorrect) {
                this.stage.backgroundColor = '#b1d256';
            } else {
                this.stage.backgroundColor = '#ae4f0e';
            }
        }, this);
        this.ready = false;

        // console.log(screen);
        screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
        if (screen.lockOrientationUniversal) {
            if (screen.lockOrientationUniversal('portrait-primary')) {
                this.stage.backgroundColor = '#d1d256';
            } else {
                this.stage.backgroundColor = '#41d256';
            }
        }
    },

    preload: function () {
        this.stage.backgroundColor = '#b1d256';

        this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
        this.add.text(this.game.width / 2, this.game.height / 2 - 30, "Loading...", { font: "32px monospace", fill: "#fff" }).anchor.setTo(0.5, 0.5);

        this.load.setPreloadSprite(this.preloadBar);

        //Bitmap Fonts
        this.load.bitmapFont('coolvetica', 'assets/fonts/coolvetica_regular_32_0.png', 'assets/fonts/coolvetica_regular_32.xml');

        // Load the rest of the assets
        this.load.image('logo', 'assets/logo2.png');
        this.load.spritesheet('blueButton', 'assets/menu/blue_button_123.png', 580, 123);
        this.load.image('button', 'assets/menu/button_background.png');

        // ClickyTap
        this.load.spritesheet('chick', 'assets/clickyTap/chick.png', 72, 72);
        this.load.image('egg',      'assets/clickyTap/chick-egg.png');
        this.load.image('house',    'assets/clickyTap/chick-house.png');
        this.load.audio('squawk1',  ['assets/clickyTap/squawk_1.ogg', 'assets/clickyTap/squawk_1.m4a']);
        this.load.audio('squawk2',  ['assets/clickyTap/squawk_2.ogg', 'assets/clickyTap/squawk_2.m4a']);

        // SpriteShoot
        this.load.image('target',   'assets/spriteShoot/target.png');
        this.load.image('bomb', 'assets/spriteShoot/bomb.png');
        this.load.image('explode', 'assets/spriteShoot/bomb_explosion.png')
        this.load.image('background','assets/spriteShoot/SpriteShootBackground.png');
        this.load.spritesheet('targetPieces', 'assets/spriteShoot/target.png', 18, 18);
        this.load.audio('targetHit', ['assets/spriteShoot/LaserTargetHit.ogg', 'assets/spriteShoot/LaserTargetHit.m4a']);
        this.load.audio('wrongTarget', ['assets/spriteShoot/wrong_target.ogg', 'assets/spriteShoot/wrong_target.m4a']);
        // debugger;
    },

    create: function () {
        this.preloadBar.cropEnabled = false;
    },

    update: function () {
        // if (WebFont.active === false) return;
        if (this.cache.isSoundDecoded('squawk1') && this.ready == false) {
            this.ready = true;
            this.state.start('Menu_MainMenu');
        }

    }
}

module.exports = Preload;