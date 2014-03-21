function Grid(size) {
  this.size = size;

  this.cells = [];

  this.build();
}

// Build a grid of the specified size
Grid.prototype.build = function () {
  for (var x = 0; x < this.size; x++) {
    var row = this.cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};

// Get the state of a grid
Grid.prototype.getState = function() {
  // We can report the state of only 4x4 grids
  if (this.size != 4) {
    throw 'State undefined for grid of size ' + this.size;
  }

  var state1 = 0x00000000;
  var state2 = 0x00000000;

  // Go through each cell, adding the log2 of its tile's value (if present) to state1
  // or state2
  for (var stateX = 0; stateX < this.size; stateX++) {
    for (var stateY = 0; stateY < this.size; stateY++) {
      // (x = 0, y = 0) is the top left
      // (stateX = 0, stateY = 0) is the bottom left
      var x = stateX;
      var y = this.size - 1 - stateY;

      var val = this.cells[x][y] ?
        Math.log(this.cells[x][y].value)/Math.log(2) :
        0;
      var offset = stateY * this.size + stateX;

      if (offset < Grid.CELLS_PER_STATE) {
        state2 += (val * Math.pow(Grid.MAX_CELL_VAL + 1, offset));
      } else {
        state1 += (val * Math.pow(Grid.MAX_CELL_VAL + 1, offset - Grid.CELLS_PER_STATE));
      }
    }
  }

  return [state1, state2];
}

// TODO: Move to other file
Grid.CELLS_PER_STATE = 8;
Grid.MAX_CELL_VAL = 15;

module.exports = Grid;