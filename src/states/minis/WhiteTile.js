
var WhiteTile = function () {

};

WhiteTile.prototype = {
  preload: function () {},
  init: function () {
    console.log('WhiteTile: init');
    this.inPlay = true;

    this.split = 4;
    this.rows = 40;
    this.cols = 4;
    this.tileWidth = this.world.width / this.split;
    this.tileHeight = this.world.height / this.split;
    this.constSpeed = 2;

    this.points = 0;
    this.nextTileId = this.rows;

    this.generateTiles(this.split, this.rows, this.cols);
    this.activateTiles();

    this.setupEnd();
  },

  generateTiles: function (split, rows, cols) {
    var graphic = this.make.graphics(0, 0);
    var tileHeight = this.tileHeight;
    var tileWidth = this.tileWidth;
    var rowsOffset = -rows + split;
    var r = rows;
    var c = cols;
    var colorCheck = false;
    var rand;
    var tile;

    var whiteTexture;
    var blackTexture;

    graphic.lineStyle(3, 0x000000, 1);
    graphic.beginFill(0xFFFFFF, 1);
    graphic.drawRect(0, 0, tileWidth, tileHeight);
    graphic.endFill();
    whiteTexture = graphic.generateTexture();

    graphic.beginFill(0x000000, 1);
    graphic.drawRect(0, 0, tileWidth, tileHeight);
    graphic.endFill();
    blackTexture = graphic.generateTexture();

    this.tiles = this.add.group();
    this.tiles.y -= tileHeight;
    for (r = rows; r > 0; r--) {
      rand = this.rnd.between(1, 4);

      for (c = cols; c > 0; c--) {
        colorCheck = (rand === c);
        var tile = this.tiles.create(
          tileWidth * (c -1),
          tileHeight* (r -1 + rowsOffset),
          colorCheck ? blackTexture: whiteTexture
        );
        tile.color = colorCheck ? 'black': 'white';
        tile.id = colorCheck ? r : undefined;
      }
    }
  },

  activateTiles: function () {
    var tiles = this.tiles;

    var enableInput = function (child) {
      child.inputEnabled = true;
      child.events.onInputUp.add(function () {
        if (child.color !== 'black') {
          return this.gameOver('Non-white');
        }
        if (child.id !== this.nextTileId) {
          return this.gameOver('Mis-Step');
        }

        return this.pushBoard();
      }, this);
    };

    tiles.forEach(enableInput, this);

  },

  deactivateTiles: function () {
    var tiles = this.tiles;

    var disableInput = function (child) {
      child.inputEnabled = false;
    };

    tiles.forEach(disableInput, this);

  },

  gameOver: function () {
    this.constSpeed = 0;
    this.inPlay = false;
    this.deactivateTiles();
    console.log('game over');
    var enter = this.game.add
      .tween(this.endDisplay)
      .from({ y: -500 }, 900, Phaser.Easing.Elastic.Out);
    var entera = this.game.add
      .tween(this.endDisplay)
      .from({ alpha: 0 }, 400, Phaser.Easing.Quartic.Out);

    enter.start();
    entera.start();
    this.endDisplay.visible = true;

    // this.state.restart();
  },

  setupEnd: function () {
    var width = this.world.width,
      height = this.world.height,
      halfWidth = width/ 2,
      halfHeight = height/ 2;

    var graphic = this.make.graphics();
    graphic.lineStyle(0, 0x000000, 0);
    graphic.beginFill(0x000000, 0.6);
    graphic.drawRect(0, 0, width * 3, height * 3);
    graphic.endFill();
    var fullscreenCover = graphic.generateTexture();

    this.endDisplay = this.add.group();
    this.endDisplay.name = 'EndDisplay';
    this.endDisplay.visible = false;
    this.endDisplay.x

    this.endDisplay.create(-width, -height, fullscreenCover);

    this.button_Reset = this.add.button(halfWidth, halfHeight + 50 + (128 * 2), 'Retry?', 64, this.endDisplay);
    this.button_Reset.customEvents.animComplete.add(function () { this.state.restart(); }, this);
    this.game.add.tween(this.button_Reset).from({ y: -200,  }, 800, Phaser.Easing.Elastic.Out, true);


    this.button_Back = this.add.button(halfWidth, this.game.height - 100, 'Main Menu', 48, this.endDisplay);
    this.button_Back.customEvents.animComplete.add(function () { this.state.start('Menu_MainMenu'); }, this);
    this.game.add.tween(this.button_Back).from({ y: -200,  }, 800, Phaser.Easing.Elastic.Out, true);
  },

  pushBoard: function () {
    this.nextTileId -= 1;
    this.points += 1;
    this.tilesTween = this.add.tween(this.tiles)
      .to({y: this.tiles.y + this.tileHeight * this.pushForce}, 100, 'Quart.easeInOut')
      .start();
  },

  // create: function () {},

  update: function () {
    var nextTileId = this.nextTileId;
    var nextRow = this.rows - nextTileId + 1;
    var bottomEdge = this.tiles.y + this.tileHeight;
    var topEdge = this.tiles.y - (this.rows * this.tileHeight);
    var dangerZone = nextRow * this.tileHeight
    var width = this.world.width,
      height = this.world.height,
      halfWidth = width/ 2,
      halfHeight = height/ 2;

    if (!this.inPlay) return;
    console.log(topEdge);
    if (bottomEdge >= dangerZone) {
      if (this.pushForce !== 0.5) this.pushForce = 0.5;
    } else {
      if (this.pushForce !== 1) this.pushForce = 1;
    }

    if (bottomEdge - this.tileHeight >= dangerZone) {
      this.gameOver();
    }

    this.moveBoard();
  },

  moveBoard: function () {
    if (this.constSpeed === 0) return;
    this.tiles.y += this.constSpeed;
  },
  // render: function () {},
}

module.exports = WhiteTile;
