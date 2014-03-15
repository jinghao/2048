var GameManager = require('./GameManager');
var KeyboardInputManager = require('./KeyboardInputManager');
var HTMLActuator = require('./HTMLActuator');

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  var manager = new GameManager(4, KeyboardInputManager, HTMLActuator);
});