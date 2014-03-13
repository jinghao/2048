var GameTransitions = {
  move: function(currentState, direction) {


  },

  getValue: function(state, xpos, ypos) {
    var offset = (ypos * 4 + xpos);

    return (state[offset >= 8 ? 0 : 1] >> (offset * 4)) & 0xF;
  }
};

// Just for the test
if (module) {
  module.exports = GameTransitions;
}