var Directions = require('./Directions');
var Grid = require('./Grid');  // Merely to get some constants.

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
    for (var i = 0; i < Grid.SIZE; ++i) {
      var lastPos = backwards ? Grid.SIZE : -1;
      var lastPosValue = null; // not used yet

      for (var j = 0; j < Grid.SIZE; ++j) {
        var x, y;
        if (isVerticalMove) {
          x = i;
          y = backwards ? Grid.SIZE - 1 - j : j;
        } else {
          y = i;
          x = backwards ? Grid.SIZE - 1 - j : j;
        }

        var valueAtPos = GameTransitions.getValue(currentState, x, y);

        if (valueAtPos) {
          if (valueAtPos === lastPosValue) {
            valueAtPos = 1; // the amount to increment the tile value by
            lastPosValue = null;
          } else {
            lastPos += dj;
            lastPosValue = valueAtPos;
          }

          if (isVerticalMove) {
            GameTransitions.incrementTile(newState, valueAtPos, x, lastPos)
          } else {
            GameTransitions.incrementTile(newState, valueAtPos, lastPos, y);
          }
        }
      }
    }

    return newState;
  },

  // Insert a tile at position x, y, or increments the value if one
  // already exists.
  // Mutates given state.
  incrementTile: function(state, val, x, y) {
    if (val <= 0) {
      throw 'Cannot insert tile with value ' + val;
    }

    if (GameTransitions.getValue(state, x, y) + val > Grid.MAX_CELL_VAL) {
      throw 'Tile ' + GameTransitions.getValue(state, x, y) +
        ' is too large; can\'t insert tile ' + val;
    }

    var offset = GameTransitions._getOffset(x, y);

    if (offset >= Grid.CELLS_PER_STATE) {
      state[0] += val * Math.pow(
        Grid.MAX_CELL_VAL + 1,
        offset - Grid.CELLS_PER_STATE
      );
    } else {
      state[1] += val * Math.pow(Grid.MAX_CELL_VAL + 1, offset);
    }
  },

  _getOffset: function(x, y) {
    return y * Grid.SIZE + x;
  },

  getValue: function(state, xpos, ypos) {
    var offset = GameTransitions._getOffset(xpos, ypos);

    return (state[offset >= Grid.CELLS_PER_STATE ? 0 : 1]
      >> (offset * Grid.OFFSET_PER_TILE)) & 0xF;
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
    for (var x = 0; x < Grid.SIZE; x++) {
      for (var y = 0; y < Grid.SIZE; y++) {
        if (GameTransitions.getValue(state, x, y) == 0) {
          emptyCells.push([x, y]);
        }
      }
    }
    return emptyCells;
  },

  // Mainly for testing, debugging purposes
  visualize: function(state) {
    var chart = [];
    for (var y = 0; y < Grid.SIZE; ++y) {
      var row = [];
      for (var x = 0; x < Grid.SIZE; ++x) {
        row[x] = GameTransitions.getValue(state, x, y).toString(16);
      }
      chart[Grid.SIZE - 1 - y] = row.join(' ');
    }
    return chart.join("\n");
  },

  // [val, chance]
  potentialRandomTiles: [
    [1, .9],
    [2, .1]
  ]
};

module.exports = GameTransitions;
