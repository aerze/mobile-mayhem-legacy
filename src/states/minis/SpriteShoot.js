
var SpriteShoot = function () {

};

SpriteShoot.prototype = {

    preload: function () {
        this.load.image('target', 'assets/spriteShoot/NEW_target.png');
        this.load.image('bomb', 'assets/spriteShoot/bomb.png');
        this.load.image('explosion', 'assets/spriteShoot/bomb_explosion.png')
        this.load.image('background','assets/spriteShoot/SpriteShootBackground.png');
        this.load.spritesheet('targetPieces', 'assets/spriteShoot/target_pieces.png', 5, 5);
        this.load.audio('targetHit', 'assets/spriteShoot/LaserTargetHit.ogg');
        this.load.audio('wrongTarget', 'assets/spriteShoot/Explosion.ogg');

    },

    create: function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.setupBackground();
        this.setupAudio();
        this.setupText();
        this.setupEmitters();
        this.setupTarget();
        this.setupBomb();
        this.setupExplosion();
        this.setupTimers();
    },

    update: function () {
        this.updateCountdown();
        if (this.gameTimer.expired &&
            this.targetPool.countDead() === 15 &&
            this.bombPool.countDead() === 10) {
            this.endGame();
        }
    },

    quitGame: function () {
        this.state.start('MainMenu');
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
        this.background = this.add.sprite(this.game.width/2, this.game.height/2, 'background');
        this.background.anchor.setTo(0.5,0.5);
        this.background.scale.setTo(1.2,1.2);
        this.stage.backgroundColor = '#fff';
    },

    setupAudio: function () {
        this.sound.volume = 0.3;
        this.targetHitSFX1 = this.add.audio('targetHit');
        this.wrongTargetSFX2 = this.add.audio('wrongTarget');
    },

    setupText: function () {
        this.instructions = this.add.text(this.game.width/2,200,
        'SHOOT THE TARGETS\nNOT THE BOMBS!', this.presetFont(70));
        this.instructions.anchor.setTo(0.5,0.5);

        this.countdownText = this.add.text(this.game.width/2, this.game.height/2 - 250,
        '3', this.presetFont(70));
        this.countdownText.anchor.setTo(0.5, 0.5);

        this.score = 0;
        this.scoreText = this.add.bitmapText(this.game.width/2, this.game.height/2 + 250, 'coolvetica','',64);
        this.scoreText.anchor.setTo(0.5, 0.5);
    },

    setupTimers: function () {
        this.startTimer = this.time.create(false);
        this.gameTimer = this.time.create(true);

        this.startTimer.add(Phaser.Timer.SECOND * 2.5, this.startGame, this);
        // this.gameTimer.add(Phaser.Timer.SECOND * 20, this.endGame, this);
        this.gameTimer.repeat(Phaser.Timer.SECOND * 0.4, 40, this.spawnTarget, this);

        this.startTimer.start();
    },

    setupTarget: function() {
      this.targetPool = this.add.group();
      this.targetPool.enableBody = true;
      this.targetPool.physicsBodyType = Phaser.Physics.ARCADE;
      this.targetPool.createMultiple(15, 'target');
      //this.targetPool.body.setSize(200,200,0,0);
      this.targetPool.setAll('scale.x', 1.5);
      this.targetPool.setAll('scale.y', 1.5);
      this.targetPool.setAll('anchor.x', 0.5);
      this.targetPool.setAll('anchor.y', 0.5);
      this.targetPool.setAll('outOfBoundsKill', true);
      this.targetPool.setAll('checkWorldBounds', true);
    //   this.enemyPool.forEach(function (enemy) {
    //     enemy.animations.add('fly', [0,1,2], 20, true);
    //     enemy.animations.add('hit', [3,1,3,2], 20, false);
    //     enemy.events.onAnimationComplete.add(function (e) {
    //         e.play('fly');
    //         }, this);
    },

    setupBomb: function() {
      this.bombPool = this.add.group();
      this.bombPool.enableBody = true;
      this.bombPool.physicsBodyType = Phaser.Physics.ARCADE;
      this.bombPool.createMultiple(10, 'bomb');
      this.bombPool.setAll('scale.x', 2);
      this.bombPool.setAll('scale.y', 2);
      this.bombPool.setAll('anchor.x', 0.5);
      this.bombPool.setAll('anchor.y', 0.5);
      this.bombPool.setAll('outOfBoundsKill', true);
      this.bombPool.setAll('checkWorldBounds', true);
    //   this.enemyPool.forEach(function (enemy) {
    //     enemy.animations.add('fly', [0,1,2], 20, true);
    //     enemy.animations.add('hit', [3,1,3,2], 20, false);
    //     enemy.events.onAnimationComplete.add(function (e) {
    //         e.play('fly');
    //         }, this);
    },

    setupExplosion: function () {
      this.explosionPool = this.add.group();
      this.explosionPool.enableBody = true;
      this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
      this.explosionPool.createMultiple(10, 'explosion');
      this.explosionPool.setAll('scale.x', 0.5);
      this.explosionPool.setAll('scale.y', 0.5);
      this.explosionPool.setAll('anchor.x', 0.5);
      this.explosionPool.setAll('anchor.y', 0.5);
    },

    setupEmitters: function () {
        this.targetPieceEmitter = this.add.emitter(this.game.width/2, this.game.height/2, 300);
                                          // other particles, world bounds
        this.targetPieceEmitter.makeParticles('targetPieces', [0,1,1,1,0], 300, true, false);
        this.targetPieceEmitter.maxParticleSpeed.setTo(300, -300);
        this.targetPieceEmitter.gravity = 150;
        this.targetPieceEmitter.angularDrag = 30;
        this.targetPieceEmitter.maxParticleScale = 1.0;
        this.targetPieceEmitter.minParticleScale = 1.0;
        this.targetPieceEmitter.bounce.setTo(0.5, 0.5);

    },

     updateCountdown: function () {
        if (this.gameTimer.running) {
            // this.countdownText.text = Math.ceil(this.gameTimer.duration / Phaser.Timer.SECOND);
            this.countdownText.text = Math.ceil(this.gameTimer.seconds);
        } else if (this.startTimer.running) {
            this.countdownText.text = Math.ceil(3 - this.startTimer.seconds);
        }
    },

    spawnTarget: function () {
        // if (this.targetPool.countDead() <= 0) return;
        var target = {};
        if(this.rnd.integerInRange(1,10) >= 3) {
            target = this.targetPool.getFirstExists(false);
        } else {
            target = this.bombPool.getFirstExists(false);
        }

        this.game.physics.enable(target, Phaser.Physics.ARCADE);

        target.reset(-50,
            this.rnd.integerInRange(200, this.game.height - 200), 1);

        target.body.allowGravity = true;
        target.body.moves = true;
        target.body.gravity.setTo(0, 500);
        target.body.drag.x = 10;
        target.body.bounce = 0.5;
        target.body.velocity.setTo(700, -350);

        target.inputEnabled = true;
        target.events.onInputDown.add(this.addToScore, this);

        // var movePointY = this.rnd.integerInRange(200, this.game.height - 200);
        // this.physics.arcade.accelerateToXY(
        //     target,
        //     this.game.width/2,
        //     movePointY,
        //     this.rnd.integerInRange(10000,20000)
        // );
    },


    addToScore: function (sprite) {
        if (sprite.key === 'target') {
            this.score += 1;
            this.targetPieceEmitter.x = sprite.x;
            this.targetPieceEmitter.y = sprite.y;
            // this.targetPieceEmitter.start(true, 1000, null, 25);
            this.targetHitSFX1.play();
        } else {
            this.wrongTargetSFX2.play();
            this.score -= 1

            var scale = 3;
            this.explosion = this.explosionPool.getFirstExists(false);
            this.explosion.reset(sprite.x, sprite.y);
            this.explosion.scale.setTo(0.5, 0.5);

            this.boomTween = this.game.add.tween(this.explosion.scale);
            this.boomTween.to({x: scale, y: scale}, 500).start();
            this.boomTween.onComplete.add(function (scale, tween) {
                this.explosion.kill();
            }, this);

            // game.add.tween(player)
            //     .to({x:500}, 400) //change player.x to 500 over 400ms
            //     .start();

        }
        this.scoreText.setText('' + this.score);
        // this.scoreText.fontSize = 70 + (this.score * 3.5);
        sprite.kill();
    },

    startGame: function () {
        this.countdownText.anchor.setTo(0,0);
        this.countdownText.position.setTo(10,10);
        this.countdownText.destroy();
        this.instructions.destroy();

        // this.startTimer.stop();
        this.startTimer.destroy();
        this.targetPool.inputEnabled = true;
        this.gameTimer.start();
    },

    endGame: function () {
        this.targetPool.inputEnabled = false;
        this.displayEnd();
        this.gameTimer.stop();
    },

    displayEnd: function () {
        if (this.endText && this.endText.exists) return;
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
            this.state.restart('Mini_SpriteShoot');
        }, this);
    }
}


module.exports = SpriteShoot;