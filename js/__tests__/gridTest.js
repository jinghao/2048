var Grid = require('../grid');
var Tile = require('../tile');

describe('getState', function() {
  it('should throw an exception if the grid is not 4x4', function() {
    expect(function() {
      var grid = new Grid(3);
      grid.getState();
    }).toThrow();
  });

  [
    {
      // cells uses the same coordinate system as Grid, and similar representation
      // ie: (0,0) is top left
      cells: [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null]
      ],
      expected: [0x00000000, 0x00000000]
    },
    {
      cells: [
        [2048, 2048, 2048, 2048],
        [2048, 2048, 2048, 2048],
        [2048, 2048, 2048, 2048],
        [2048, 2048, 2048, 2048]
      ],
      expected: [0xbbbbbbbb, 0xbbbbbbbb]
    },
    {
      cells: [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [2, null, null, null]
      ],
      expected: [0x10000000, 0x00000000]
    },
    {
      cells: [
        [null, null, null, 8],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, 2, null]
      ],
      expected: [0x00000000, 0x10000003]
    },
    {
      cells: [
        [4, null, null, 2048],
        [null, null, null, null],
        [null, null, null, null],
        [null, 4, 4, 8]
      ],
      expected: [0x00022000, 0x2000300b]
    }
  ].forEach(function(testInput) {
    it('tests ' + testInput.cells, function() {
      // Create a grid and insert tiles as specified by testInput.cells
      var grid = new Grid(4);
      grid.eachCell(function(x, y, cell) {
        if (testInput.cells[x][y]) {
          var tile = new Tile({x: x, y: y}, testInput.cells[x][y]);
          grid.insertTile(tile);
        }
      });

      expect(grid.getState()).toEqual(testInput.expected);
    });
  });
});
