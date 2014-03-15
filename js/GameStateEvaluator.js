var GameTransitions = require('./GameTransitions');

var GameStateEvaluator = {
  // Return the score of a pair of squares.
  getScorePair: function(val1, val2) {
    return 1 << Math.abs(val1 - val2);
  },

  // Return the score of the state specified.
  // score = sum(scores between neighboring squares)
  getScore: function(state) {
    var score = 0;

    // Compare neighbors to the right.
    for (var xpos = 0; xpos < 3; xpos++) {
      for (var ypos = 0; ypos <= 3; ypos++) {
        score += GameStateEvaluator.getScorePair(
          GameTransitions.getValue(state, xpos,ypos),
          GameTransitions.getValue(state, xpos + 1, ypos)
        );
      }
    }

    // Compare neighbors above.
    for (var xpos = 0; xpos <= 3; xpos++) {
      for (var ypos = 0; ypos < 3; ypos++) {
        score += GameStateEvaluator.getScorePair(
          GameTransitions.getValue(state, xpos,ypos),
          GameTransitions.getValue(state, xpos, ypos + 1)
        );
      }
    }

    return score;
  }
};

if (module) {
  module.exports = GameStateEvaluator;
}