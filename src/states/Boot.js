
var Boot = function () {

};

Boot.prototype = {

    init: function () {
    var body = document.querySelector('body');
    var container = document.querySelector('#gameContainer');

    // Only change if we need multiTouch
    this.input.maxPointers = 1;

    if (this.game.device.desktop) {
        body.style.width = '400px';
        body.style.margin = '10px auto';
    } else {
        container.style.height = window.innerHeight + 'px';
        container.style.width = window.innerWidth + 'px';
    }

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // this.game.firebase = this.game.plugins.add(Phaser.Plugin.FirebasePlugin);
    // this.game.net = this.game.plugins.add(Phaser.Plugin.NetworkPlugin);
    // this.game.Textbox = this.game.plugins.add(Phaser.Plugin.Textbox);
    this.game.Button = this.game.plugins.add(Phaser.Plugin.ButtonPlugin);
    this.game.Client = this.game.plugins.add(Phaser.Plugin.ClientPlugin);
    },

    preload: function () {
        this.load.image('preloaderBar', 'assets/preloader-bar.png');
    },

    create: function () {
        this.state.start('Preload');
    }
}

module.exports = Boot;