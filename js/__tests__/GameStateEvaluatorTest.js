var GameStateEvaluator = require('../GameStateEvaluator');

describe('getScorePair', function() {
  [
    {
      val1: 0,
      val2: 0,
      expected: 1
    },
    {
      val1: 2,
      val2: 3,
      expected: 2
    },
    {
      val1: 3,
      val2: 2,
      expected: 2
    },
    {
      val1: 4,
      val2: 0,
      expected: 16
    }
  ].forEach(function(testInput) {
    it('tests ' + testInput.val1 + ', ' + testInput.val2, function() {
      expect(GameStateEvaluator.getScorePair(
        testInput.val1,
        testInput.val2
      )).toEqual(testInput.expected);
    });
  });
});

describe('getScore', function() {
  [
    {
      state: [0x00000000, 0x00000000],
      expected: 24
    },
    {
      state: [0x11111111, 0x11111111],
      expected: 24
    },
    {
      state: [0x00000000, 0x00000011],
      expected: 27
    },
    {
      state: [0x00000011, 0x00000000],
      expected: 29
    },
    {
      state: [0x11000000, 0x00000000],
      expected: 27
    },
    {
      state: [0x00000001, 0x00020004],
      expected: 48
    }
  ].forEach(function(testInput) {
    it('tests ' + testInput.state.toString(), function() {
      expect(GameStateEvaluator.getScore(testInput.state)).
        toEqual(testInput.expected);
    });
  });
});
