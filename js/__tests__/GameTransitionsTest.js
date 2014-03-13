var GameTransitions = require('../GameTransitions');

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