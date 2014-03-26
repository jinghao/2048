var GameTransitions = require('./GameTransitions');
var GameStateEvaluator = require('./GameStateEvaluator');
var Directions = require('./Directions');

var GameScorePredictor = {
  // TO-DO: Double-check that losing will be handled correctly
  predictScore: function(state, move, depth) {
    if (GameTransitions.isMoveInvalid(state, move)) {
      return GameStateEvaluator.maxScore;
    }

    var scorePrediction = 0;
    var potentialOutcomes = GameScorePredictor.getPotentialOutcomes(state, move);
    for (var i = 0; i < potentialOutcomes.length; ++i) {
      var potentialOutcome = potentialOutcomes[i]
      var potentialState = potentialOutcome.state;
      var chance = potentialOutcome.chance;
      var scorePredictions = [];
      if (depth > 0) {
        for (var potentialMove in Directions) {
          var nextScorePrediction = GameScorePredictor.predictScore(
            potentialState,
            potentialMove,
            depth - 1
            );
          if (nextScorePrediction) {
            scorePredictions.push(nextScorePrediction);
          }
        }
      } else {
        scorePredictions.push(GameStateEvaluator.getScore(potentialState));
      }
      scorePrediction += GameStateEvaluator.getBestScore(scorePredictions) *
        chance;
    }
    return scorePrediction;
  }
}

module.exports = GameScorePredictor;