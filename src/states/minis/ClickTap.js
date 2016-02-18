
var ClickTap = function () {

};

ClickTap.prototype = {

    preload: function () {
        this.load.spritesheet('chick', 'assets/clickyTap/chick.png', 72, 72);
        this.load.image('egg', 'assets/clickyTap/chick-egg.png');
        this.load.image('house', 'assets/clickyTap/chick-house.png');
        this.load.audio('squawk1', 'assets/clickyTap/squawk_1.ogg');
        this.load.audio('squawk2', 'assets/clickyTap/squawk_1.ogg');
    },


    create: function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.setupBackground();
        this.setupAudio();
        this.setupText();
        this.setupEmitter();
        this.setupChick();
        this.setupTimers();
    },

    update: function () {
        // this.physics.arcade.collide(this.eggEmitter);
        this.updateCountdown();
    },

    // render: function () {},

    quitGame: function () {

        this.state.start('Menu_MainMenu');
    },

    presetFont: function (fontSize) {
        var fontSettings = {
            font: fontSize + 'px monospace',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 6,
            align: 'center'
        }

        return fontSettings
    },

    setupBackground: function () {
        this.house = this.add.sprite(this.game.width/2, this.game.height/2,'house');
        this.house.anchor.setTo(0.5, 0.5);
        this.house.scale.setTo(1.6, 1.6);
        this.stage.backgroundColor = '#fff';
    },


    setupAudio: function () {
        this.sound.volume = 0.3;
        this.squawkSFX1 = this.add.audio('squawk1');
        this.squawkSFX2 = this.add.audio('squawk2');
    },

    setupText: function () {
        this.instructions = this.add.text(this.game.width/2, 250,
        'CLICK THE CHICK!!', this.presetFont(70));
        this.instructions.anchor.setTo(0.5,0.5);


        this.countdownText = this.add.bitmapText(this.game.width/2, this.game.height/2 - 250, 'coolvetica', '', 64);
        // this.countdownText = this.add.text(this.game.width/2, this.game.height/2 - 250,
        // '', this.presetFont(70));
        this.countdownText.anchor.setTo(0,0);
        this.countdownText.position.setTo(10,10);

        this.startCountdownText = this.add.text(this.game.width/2, this.game.height/2 - 250,
        '3', this.presetFont(70));
        this.startCountdownText.anchor.setTo(0.5, 0.5);

        this.score = 0;
        // this.scoreText = this.add.text(this.game.width/2, this.game.height/2 + 250,
        // '' + this.score, this.presetFont(80));
        // this.scoreText.anchor.setTo(0.5, 0.5);

        this.scoreText = this.add.bitmapText(this.game.width/2, this.game.height/2 + 250, 'coolvetica','',64);
        // this.scoreText.scale.setTo(1.5,1.5);
        this.scoreText.anchor.setTo(0.5, 0.5);

    },

    setupTimers: function () {
        this.gameTimer = this.time.create();
        this.startTimer = this.time.create();

        this.startTimerEvent = this.startTimer.add(Phaser.Timer.SECOND * 3, this.startGame, this);
        this.gameTimerEvent = this.gameTimer.add(Phaser.Timer.SECOND * 10, this.endGame, this);

        this.startTimer.start();
    },

    setupChick: function () {
        this.chick = this.add.sprite(this.game.width/2, this.game.height/2, 'chick');
        this.chick.anchor.setTo(0.5, 0.5);
        this.chick.scale.setTo(4, 4);
        this.chick.animations.add('panic', [0,3], 4, false);
        this.chick.animations.add('normal', [1,2,1,1,1,2], 4, true);
        this.chick.play('normal');
        this.chick.inputEnabled = false;
        this.chick.events.onInputUp.add(function () {
            this.addToScore(1);
            if (this.score % 8 === 0) {
                this.chick.scale.setTo(-4, 4);
            } else if (this.score % 6 === 0) {
                this.chick.scale.setTo(4, 4);
            }
            this.chick.play('panic');
        }, this);
        this.chick.events.onAnimationComplete.add(function (event) {
            event.play('normal');
        }, this);

    },

    setupEmitter: function () {
        this.eggEmitter = this.add.emitter(this.game.width/2, this.game.height/2, 100);
        this.eggEmitter.makeParticles('egg', [0], 100, true, true);
        this.eggEmitter.maxParticleSpeed.setTo(3000, -3000);
        this.eggEmitter.minParticleSpeed.setTo(-3000, -3000);
        this.eggEmitter.angularDrag = 90;
        this.eggEmitter.maxParticleScale = 2.5;
        this.eggEmitter.minParticleScale = 2.5;
        this.eggEmitter.gravity = 200;
        this.eggEmitter.bounce.setTo(0.5, 0.5);
    },

    updateCountdown: function () {
        if (!this.startTimer.expired) {
            this.startCountdownText.text = Math.ceil(3 - this.startTimer.seconds);
        } else {
            this.countdownText.setText(Math.ceil(10 - this.gameTimer.seconds));
        }
    },

    startGame: function () {
        this.instructions.destroy();
        this.startCountdownText.text = '';

        this.chick.inputEnabled = true;
        // this.scoreText.bringToTop();
        this.gameTimer.start();
    },

    endGame: function () {
        this.chick.inputEnabled = false;
        this.displayEnd();
    },






    squawk: function (int) {
        if (int === 0) this.squawkSFX1.play();
        else this.squawkSFX2.play();
    },

    addToScore: function (score) {
        this.squawk(this.rnd.integerInRange(0, 1));
        this.score += score;
        this.scoreText.setText(this.score);
        var scale = 1.3 + (this.score/50);
        this.scoreText.scale.setTo(scale, scale);
        // this.scoreText.fontSize = 70 + (this.score * 3);
        this.eggEmitter.start(true, 2000, null, 1);
    },

    displayEnd: function () {
        // if (this.endText && this.endText.exists) return;
        this.gameOverText = this.add.text(this.game.width/2, this.game.height/2 - 300,
        'Game Over', this.presetFont(85));
        this.gameOverText.anchor.setTo(0.5, 0);

        this.endText = this.add.text(this.game.width, this.game.height,
        'Back', this.presetFont(72));
        this.endText.anchor.setTo(1, 1);
        this.endText.inputEnabled = true;
        this.endText.events.onInputUp.add(function () {
            this.state.start('Menu_SinglePlayer');
        }, this);

        this.restartText = this.add.text(0, this.game.height,
        'Replay', this.presetFont(72));
        this.restartText.anchor.setTo(0, 1);
        this.restartText.inputEnabled = true;
        this.restartText.events.onInputUp.add(function () {
            this.state.restart('Mini_ClickTap');
        }, this);
    }
}

module.exports = ClickTap;