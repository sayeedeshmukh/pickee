const analyzeDecision = require('./analyzeDecision');
const { starPoints, getItemContribution } = require('./scoring');

test('star points map 1:1 with rating', () => {
  expect(starPoints(1)).toBe(1);
  expect(starPoints(3)).toBe(3);
  expect(starPoints(5)).toBe(5);
  expect(getItemContribution(4, 'pro')).toBe(4);
  expect(getItemContribution(4, 'con')).toBe(-4);
});

test('option A wins when pros outweigh cons on B', () => {
  const result = analyzeDecision({
    prosCons: [
      { option: 'A', type: 'pro', rating: 5, text: 'fast delivery' },
      { option: 'B', type: 'con', rating: 1, text: 'expensive shipping' },
    ],
  });

  expect(result.winner).toBe('A');
  expect(result.scoreA).toBe(5);
  expect(result.scoreB).toBe(-1);
});

test('option B wins when it has stronger net score', () => {
  const result = analyzeDecision({
    prosCons: [
      { option: 'A', type: 'con', rating: 4, text: 'slow turnaround' },
      { option: 'B', type: 'pro', rating: 5, text: 'much cheaper overall' },
    ],
  });

  expect(result.winner).toBe('B');
  expect(result.scoreA).toBe(-4);
  expect(result.scoreB).toBe(5);
});

test('returns tie when net scores are equal', () => {
  const result = analyzeDecision({
    prosCons: [
      { option: 'A', type: 'pro', rating: 3, text: 'good location' },
      { option: 'B', type: 'pro', rating: 3, text: 'good benefits' },
    ],
  });

  expect(result.winner).toBe('Tie');
  expect(result.scoreA).toBe(3);
  expect(result.scoreB).toBe(3);
});

test('3-star pros and cons balance to zero per option', () => {
  const result = analyzeDecision({
    prosCons: [
      { option: 'A', type: 'pro', rating: 3, text: 'flexible hours' },
      { option: 'A', type: 'pro', rating: 3, text: 'good team' },
      { option: 'A', type: 'pro', rating: 3, text: 'near home' },
      { option: 'A', type: 'con', rating: 3, text: 'lower pay than B' },
      { option: 'A', type: 'con', rating: 3, text: 'less prestige' },
      { option: 'A', type: 'con', rating: 3, text: 'longer commute' },
    ],
  });

  expect(result.scoreA).toBe(0);
  expect(result.scoreBreakdown.optionA.proPoints).toBe(9);
  expect(result.scoreBreakdown.optionA.conPoints).toBe(9);
});

test('serious cons outweigh weak pros without extreme negatives', () => {
  const result = analyzeDecision({
    prosCons: [
      { option: 'A', type: 'pro', rating: 2, text: 'nice office view' },
      { option: 'A', type: 'pro', rating: 2, text: 'free snacks' },
      { option: 'A', type: 'con', rating: 5, text: 'major career stagnation risk' },
    ],
  });

  expect(result.scoreA).toBe(-1);
});

test('duplicate entries are counted once at highest rating', () => {
  const result = analyzeDecision({
    prosCons: [
      { option: 'A', type: 'pro', rating: 5, text: 'Better salary' },
      { option: 'A', type: 'pro', rating: 2, text: 'better salary' },
      { option: 'B', type: 'pro', rating: 3, text: 'Stable hours' },
    ],
  });

  expect(result.scoreA).toBe(5);
  expect(result.scoreB).toBe(3);
});
