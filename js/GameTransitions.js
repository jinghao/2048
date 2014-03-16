var Directions = require('./Directions');

var GameTransitions = {
  move: function(currentState, direction) {
    var newState = [currentState[0], currentState[1]];

    // the direction of the loop
    var dx = 1, dy = 1;

    switch (direction) {
      case Directions.UP:
        dy = 1;
        break;
      case Directions.DOWN:
        dy = -1;
        break;
      case Directions.LEFT:
        dx = -1;
        break;
      case Directions.RIGHT:
        dx = 1;
        break;
      default:
        console.warn("This is a bug");
    }

    var startX = 0, startY = 0, endX = 3, endY = 3;
    if (dx === -1) {
      startX = 3;
      endX = 0;
    } else if (dy === -1) {
      startY = 3;
      endY = 0;
    }

    for (var x = startX; x != endX; x += dx) {
      for (var y = startY; y != endY; y += dy) {
        
      }
    }

    return newState;
  },

  getValue: function(state, xpos, ypos) {
    var offset = (ypos * 4 + xpos);

    return (state[offset >= 8 ? 0 : 1] >> (offset * 4)) & 0xF;
  }
};

module.exports = GameTransitions;