var GameScorePredictor = require('../GameScorePredictor');
var Directions = require('../Directions');
var GameStateEvaluator = require('../GameStateEvaluator');
var GameTransitions = require('../GameTransitions');

function arraysIdentical(a, b) {
    var i = a.length;
    if (i != b.length) return false;
    while (i--) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

describe('predictScore', function() {
  [
    {
      state: [0x10000000, 0x00000000],
      move: Directions.UP,
      depth: 0,
      potentialOutcomes: {},
      bestScore: {},
      score: {},
      expected: GameStateEvaluator.maxScore
    }, {
      state: [0x10000000, 0x00000000],
      move: Directions.DOWN,
      depth: 0,
      potentialOutcomes: {
        0x10000000: {0x00000000: {
            1: [  // Directions.DOWN
              {
                state: [0x00000011, 0x00000000],
                chance: 0.8
              },
              {
                state: [0x11000000, 0x00000000],
                chance: 0.2
              }
            ]
          }
        }
      },
      bestScore: [
        {
          scores: [29],
          val: 29
        },
        {
          scores: [27],
          val: 27
        }
      ],
      score: {
        0x00000011: {
          0x00000000: 29
        },
        0x11000000: {
          0x00000000: 27
        }
      },
      expected: 28.6  // 29 * 0.8 + 27 * 0.2
    }
  ].forEach(function(testInput) {
    it('tests \n' + GameTransitions.visualize(testInput.state) + '\n' +
      testInput.move + ' ' + testInput.depth,
      function() {
        // getPotentialOutcomesBackup = GameScorePredictor.getPotentialOutcomes;
        getBestScoreBackup = GameStateEvaluator.getBestScore;
        getScoreBackup = GameStateEvaluator.getScore;

        GameScorePredictor.getPotentialOutcomes = function(state, move) {
          expect(state).toBe(testInput.state);
          expect(move).toBe(testInput.move);

          return testInput.potentialOutcomes[state[0]][state[1]][move];
        }

        GameStateEvaluator.getBestScore = function(scores) {
          for (i = 0; i < testInput.bestScore.length; ++i) {
            bestScore = testInput.bestScore[i];
            if (arraysIdentical(scores, bestScore.scores)) {
              return bestScore.val;
            }
          }

          throw 'Cannot find best score for ' + scores.toString();
        }

        GameStateEvaluator.getScore = function(state) {
          return testInput.score[state[0]][state[1]];
        }

        expect(GameScorePredictor.predictScore(
          testInput.state,
          testInput.move,
          testInput.depth
        )).toEqual(testInput.expected);

        // GameScorePredictor.getPotentialOutcomes = getPotentialOutcomesBackup;
        GameStateEvaluator.getScore = getScoreBackup;
        GameStateEvaluator.getBestScore = getBestScoreBackup;
      });
  });
});