var GameTransitions = require('./GameTransitions');
var Grid = require('./Grid');

var maxState = [0x0, 0x0];

// Make every other cell the max value
for (var x = 0; x < Grid.SIZE; x++) {
  for (var y = 0; y < Grid.SIZE; y++) {
    if ((Math.abs(x - y) % 2) == 1) {
      GameTransitions.setTile(
        maxState,
        Grid.MAX_CELL_VAL,
        x,
        y
      );
    }
  }
}

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
  },

  // Return the best score in the list (the lowest)
  // If it's empty, return the max score
  getBestScore: function(scores) {
    if (scores.length == 0) {
      return GameStateEvaluator.maxScore;
    } else {
      return Math.min.apply(Math, scores);
    }
  },
};

// Max possible score
GameStateEvaluator.maxScore = GameStateEvaluator.getScore(maxState);

module.exports = GameStateEvaluator;