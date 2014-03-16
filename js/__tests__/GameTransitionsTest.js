var GameTransitions = require('../GameTransitions');
var Directions = require('../Directions');

describe('move', function() {
  [
    { // nothing to do
      state: [0x00000000, 0x00000000],
      direction: Directions.UP,
      expectedState: [0x00000000, 0x00000000]
    }
  ].forEach(function(testInput) {
    it('test', function() {
      expect(GameTransitions.move(
        testInput.state,
        testInput.direction
      )).toEqual(testInput.expectedState);
    });
  });
});

describe('insertTile', function() {
  it('should throw an exception if the value is too small',
     function() {
      expect(function() {
        GameTransitions.insertTile([0x00000000, 0x00000000], 0, 0, 0);
      }).toThrow();
     });
  it('should throw an exception if the value is too big',
     function() {
      expect(function() {
        GameTransitions.insertTile([0x00000000, 0x00000000], 16, 0, 0);
      }).toThrow();
     });
  it('should throw an exception if there is already a tile at the position',
    function() {
      expect(function() {
        GameTransitions.insertTile([0x00000000, 0x00000001], 2, 0, 0);
      }).toThrow();
    });

  [
    {
      state: [0x00000000, 0x00000000],
      val: 1,
      xpos: 0,
      ypos: 0,
      expectedState: [0x00000000, 0x00000001]
    },
    {
      state: [0x00000000, 0x00000000],
      val: 1,
      xpos: 3,
      ypos: 3,
      expectedState: [0x10000000, 0x00000000]
    },
    {
      state: [0x00000000, 0x00000000],
      val: 1,
      xpos: 0,
      ypos: 0,
      expectedState: [0x00000000, 0x00000001]
    },
    {
      state: [0x00000000, 0x00000000],
      val: 15,
      xpos: 0,
      ypos: 0,
      expectedState: [0x00000000, 0x0000000f]
    }
  ].forEach(function(testInput) {
    it('tests ' + testInput.state[0].toString(16) + ' ' +
       testInput.state[1].toString(16) + ' ' + testInput.val,
       function() {
        expect(GameTransitions.insertTile(
          testInput.state,
          testInput.val,
          testInput.xpos,
          testInput.ypos
        )).toEqual(testInput.expectedState);
       });
  })
})

describe('getValue', function() {
  [
    {
      state: [0x00000000, 0x00000030],
      xpos: 1,
      ypos: 0,
      expected: 3
    },
    {
      state: [0x00000009, 0x00000030],
      xpos: 0,
      ypos: 2,
      expected: 9
    },
    {
      state: [0x00000009, 0xF0000030],
      xpos: 3,
      ypos: 1,
      expected: 0xF
    },
    {
      state: [0xF0000009, 0xF0000030],
      xpos: 3,
      ypos: 3,
      expected: 0xF
    },
    {
      state: [0x04000000, 0x00000030],
      xpos: 2,
      ypos: 3,
      expected: 4
    }
  ].forEach(function(testInput) {
    it('tests ' + testInput.xpos + ', ' + testInput.ypos, function() {
      expect(GameTransitions.getValue(
        testInput.state,
        testInput.xpos,
        testInput.ypos
      )).toEqual(testInput.expected);
    });
  });
});

describe('isMoveInvalid', function() {
  [
    {
      desc: '0x00000000, 0x00000001, LEFT',
      state: [0x00000000, 0x00000001],
      move: Directions.LEFT,
      expected: true
    },
    {
      desc: '0x00000000, 0x00000001, UP',
      state: [0x00000000, 0x00000001],
      move: Directions.UP,
      expected: false
    },
    {
      desc: '0x00000000, 0x00010001, LEFT',
      state: [0x00000000, 0x00010001],
      move: Directions.LEFT,
      expected: false
    }
  ].forEach(function(testInput) {
    xit('test: ' + testInput.desc, function() {
      // Test is pending completion of GameTransitions.move
      expect(GameTransitions.isMoveInvalid(
        testInput.state,
        testInput.move
      )).toEqual(testInput.expected);
    });
  });
});

describe('getEmptyCells', function() {
  var allCells = [];
  for (var x = 0; x < 4; x++) {
    for (var y = 0; y < 4; y++) {
      allCells.push([x, y]);
    }
  }

  [
    {
      desc: '0x00000000, 0x00000000',
      state: [0x00000000, 0x00000000],
      expected: allCells
    },
    {
      desc: '0x12345678, 0x12345678',
      state: [0x12345678, 0x12345678],
      expected: []
    },
    {
      desc: '0x12305678, 0x12345678',
      state: [0x12305678, 0x12345678],
      expected: [[0, 3]]
    }
  ].forEach(function(testInput) {
    it('test: ' + testInput.desc, function() {
      expect(GameTransitions.getEmptyCells(
        testInput.state
      ).sort()).toEqual(testInput.expected.sort());
    });
  });
});