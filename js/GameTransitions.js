var Directions = require('./Directions');
var Grid = require('./Grid');  // Merely to get some constants.

var GRID_SIZE = 4;  // TO-DO: Put this somewhere meaningful.

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
        var valueAtPos = GameTransitions.getValue(newState, x, y);
      }
    }

    return newState;
  },

  // Insert a tile at position x, y
  insertTile: function(state, val, x, y) {
    if (val <= 0 || val > Grid.MAX_CELL_VAL - 1) {
      throw 'Cannot insert tile with value ' + val;
    }

    if (GameTransitions.getValue(state, x, y) != 0) {
      throw 'Tile ' + GameTransitions.getValue(state, x, y) +
        ' already in position ' + x + ', ' + y +
        '; can\'t insert tile ' + val;
    }

    var offset = y * GRID_SIZE + x;
    var newState;

    if (offset >= Grid.CELLS_PER_STATE) {
      newState = [state[0] +
                    (val * Math.pow(Grid.MAX_CELL_VAL,
                                    offset - Grid.CELLS_PER_STATE)),
                  state[1]];
    } else {
      newState = [state[0], state[1] +
                    (val * Math.pow(Grid.MAX_CELL_VAL, offset))];
    }
    return newState;
  },

  getValue: function(state, xpos, ypos) {
    var offset = (ypos * 4 + xpos);

    return (state[offset >= 8 ? 0 : 1] >> (offset * 4)) & 0xF;
  },

  // A move is invalid if the state after moving is the same as
  // before moving
  isMoveInvalid: function(state, move) {
    var movedState = GameTransitions.move(state, move);

    return (movedState[0] == state[0] && movedState[1] == state[1]);
  },

  // Return the positions of cells that are empty
  // ie: [[x1, y1], [x2, y2]]
  getEmptyCells: function(state) {
    var emptyCells = [];
    for (var x = 0; x < GRID_SIZE; x++) {
      for (var y = 0; y < GRID_SIZE; y++) {
        if (GameTransitions.getValue(state, x, y) == 0) {
          emptyCells.push([x, y]);
        }
      }
    }
    return emptyCells;
  }
};

module.exports = GameTransitions;
