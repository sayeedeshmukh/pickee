const analyzeDecision = require('./analyzeDecision');

test('option A wins when it has higher score', () => {
  const input = {
    prosCons: [
      { option: 'A', type: 'pro', rating: 3, text: 'fast' },
      { option: 'B', type: 'con', rating: 1, text: 'expensive' }
    ]
  };

  const result = analyzeDecision(input);

  expect(result.winner).toBe('A');
});

test('option B wins when it has higher score', () => {
  const input = {
    prosCons: [
      { option: 'A', type: 'con', rating: 2, text: 'slow' },
      { option: 'B', type: 'pro', rating: 5, text: 'cheap' }
    ]
  };

  const result = analyzeDecision(input);

  expect(result.winner).toBe('B');
});

test('returns tie when scores are equal', () => {
  const input = {
    prosCons: [
      { option: 'A', type: 'pro', rating: 2, text: 'fast' },
      { option: 'B', type: 'pro', rating: 2, text: 'cheap' }
    ]
  };

  const result = analyzeDecision(input);

  expect(result.winner).toBe('Tie'); // adjust if needed
});