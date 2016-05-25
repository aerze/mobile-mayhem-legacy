
// Import states
var MM = require('./states/MM');

window.onload = function () {
  var game = new Phaser.Game(
    740, 1200, Phaser.AUTO, 'gameContainer');
  window.game = game; // TODO Remove in production

  for (key in MM) {
    game.state.add(key, MM[key]);
  }

  game.state.start('Boot');
};

// Import Plugins
// Plugins attach themselves so don't need to be assigned
require('./plugins/buttonPlugin');
