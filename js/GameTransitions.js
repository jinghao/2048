var Directions = require('./Directions');
var Grid = require('./Grid');  // Merely to get some constants.

var GRID_SIZE = 4;  // TO-DO: Put this somewhere meaningful.

var GameTransitions = {
  move: function(currentState, direction) {
    var newState = [0, 0];

    // should iterate toward the origin
    var backwards = 
      direction === Directions.UP || direction === Directions.RIGHT;

    var isVerticalMove =
      direction === Directions.UP || direction === Directions.DOWN;

    var dj = backwards ? -1 : 1;

    // Loop in direction perpendicular to "direction". Can be in any order
    for (var i = 0; i < GRID_SIZE; ++i) {
      var lastPos = backwards ? GRID_SIZE : -1;
      var lastPosValue = null; // not used yet

      for (var j = 0; j < GRID_SIZE; ++j) {
        var x, y;
        if (isVerticalMove) {
          x = i;
          y = backwards ? GRID_SIZE - 1 - j : j;
        } else {
          y = i;
          x = backwards ? GRID_SIZE - 1 - j : j;
        }

        var valueAtPos = GameTransitions.getValue(currentState, x, y);

        if (valueAtPos) {
          if (isVerticalMove) {
            lastPos += dj;
            GameTransitions.insertTile(newState, valueAtPos, x, lastPos)
          } else {
            lastPos += dj;
            GameTransitions.insertTile(newState, valueAtPos, lastPos, y);
          }

          lastPosValue = valueAtPos; // not used yet
        }
      }
    }

    return newState;
  },

  // Insert a tile at position x, y. Mutates
  insertTile: function(state, val, x, y) {
    if (val <= 0 || val > Grid.MAX_CELL_VAL) {
      throw 'Cannot insert tile with value ' + val;
    }

    if (GameTransitions.getValue(state, x, y) != 0) {
      throw 'Tile ' + GameTransitions.getValue(state, x, y) +
        ' already in position ' + x + ', ' + y +
        '; can\'t insert tile ' + val;
    }

    var offset = y * GRID_SIZE + x;

    if (offset >= Grid.CELLS_PER_STATE) {
      state[0] += (val * Math.pow(Grid.MAX_CELL_VAL + 1,
                                    offset - Grid.CELLS_PER_STATE));
    } else {
      state[1] += (val * Math.pow(Grid.MAX_CELL_VAL + 1, offset));
    }
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
