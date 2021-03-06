var GameTransitions = require('../GameTransitions');
var Directions = require('../Directions');

describe('move', function() {
  [
    { 
      testName: 'nothing to do',
      state: [0x00000000, 0x00000000],
      direction: Directions.UP,
      expectedState: [0x00000000, 0x00000000]
    },
    { 
      testName: 'no change, everything already on top-right corner',
      state: [0x10000000, 0x00000000],
      direction: Directions.UP,
      expectedState: [0x10000000, 0x00000000]
    },
    { 
      testName: 'no change, everything already on top-right corner',
      state: [0x10000000, 0x00000000],
      direction: Directions.RIGHT,
      expectedState: [0x10000000, 0x00000000]
    },
    { 
      testName: 'no merging, everything shifts to top',
      state: [0x10020600, 0x00000040],
      direction: Directions.UP,
      expectedState: [0x16420000, 0x00000000]
    },
    { 
      testName: 'Merging to the right, packed together',
      state: [0x11000000, 0x00000000],
      direction: Directions.RIGHT,
      expectedState: [0x20000000, 0x00000000]
    },
    { 
      testName: 'Merging to the right, spread apart',
      state: [0x02200000, 0x00000000],
      direction: Directions.RIGHT,
      expectedState: [0x30000000, 0x00000000]
    },
    { 
      testName: 'Some merging, some not',
      state: [0x02230000, 0x00000000],
      direction: Directions.RIGHT,
      expectedState: [0x33000000, 0x00000000]
    }
  ].forEach(function(testInput) {
    it(testInput.testName, function() {
      var actualNewState = GameTransitions.move(
        testInput.state,
        testInput.direction
      );

      expect(actualNewState).toEqual(
        testInput.expectedState,
        GameTransitions.visualize(actualNewState),
        GameTransitions.visualize(testInput.expectedState)
      );
    });
  });
});

describe('visualize', function() {
  it('should visualize empty states', function() {
    expect(
      GameTransitions.visualize([0x00000000, 0x00000000])
    ).toEqual(
      "0 0 0 0\n" + 
      "0 0 0 0\n" +
      "0 0 0 0\n" +
      "0 0 0 0"
    );
  });

  it('should visualize states in the right direction', function() {
    expect(
      GameTransitions.visualize([0xFEDCBA98, 0x76543210])
    ).toEqual(
      "c d e f\n" + 
      "8 9 a b\n" +
      "4 5 6 7\n" +
      "0 1 2 3"
    );
  });
});

describe('setTile', function() {
  it('should throw an exception if the value is too small',
    function() {
      expect(function() {
        GameTransitions.setTile([0x00000000, 0x00000000], 0, 0, 0);
      }).toThrow();
    }
  );
  it('should throw an exception if the given value is too big',
    function() {
      expect(function() {
        GameTransitions.setTile([0x00000000, 0x00000000], 16, 0, 0);
      }).toThrow();
    }
  );

  [
    {
      state: [0x00000000, 0x00000005],
      val: 15,
      xpos: 0,
      ypos: 0,
      expectedState: [0x00000000, 0x0000000F]
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
    },
    { // adding a large tile to the extreme left
      state: [0x00000000, 0xF0000000],
      val: 15,
      xpos: 3,
      ypos: 3,
      expectedState: [0xF0000000, 0xF0000000]
    }
  ].forEach(function(testInput) {
    it('tests ' + testInput.state[0].toString(16) + ' ' +
       testInput.state[1].toString(16) + ' ' + testInput.val,
      function() {
        // clone it
        var modifiedState = testInput.state.slice(0);

        GameTransitions.setTile(
          modifiedState,
          testInput.val,
          testInput.xpos,
          testInput.ypos
        );

        expect(modifiedState).toEqual(testInput.expectedState);
      }
    );
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
      movedState: [0x00000000, 0x00000001],
      move: Directions.LEFT,
      expected: true
    },
    {
      desc: '0x00000000, 0x00000001, UP',
      state: [0x00000000, 0x00000001],
      movedState: [0x00010000, 0x00000000],
      move: Directions.UP,
      expected: false
    },
    {
      desc: '0x00000000, 0x00010001, LEFT',
      state: [0x00000000, 0x00000011],
      movedState: [0x00000000, 0x00000002],
      move: Directions.LEFT,
      expected: false
    }
  ].forEach(function(testInput) {
    it('test: ' + testInput.desc, function() {
      var numCallsToMove = 0;

      var moveBackup = GameTransitions.move;

      GameTransitions.move = function(currentState, direction) {
        expect(direction).toBe(testInput.move);
        expect(currentState).toBe(testInput.state);

        ++numCallsToMove;

        return testInput.movedState;
      };

      expect(GameTransitions.isMoveInvalid(
        testInput.state,
        testInput.move
      )).toEqual(testInput.expected);

      // We shouldn't have to compute the same move twice
      expect(numCallsToMove).toBe(1);

      GameTransitions.move = moveBackup;
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