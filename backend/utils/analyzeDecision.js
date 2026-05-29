const { computeWeightedScores, formatScoreFormula } = require('./scoring');

function analyzeDecision({ prosCons, userPreference, mindset }) {
  const { scoreA, scoreB, emotionalWeight, practicalWeight, scoredItems, breakdown } =
    computeWeightedScores(prosCons);

  let prosA = [];
  let consA = [];
  let prosB = [];
  let consB = [];

  for (const item of scoredItems) {
    if (item.option === 'A') {
      if (item.type === 'pro') prosA.push(item.text);
      if (item.type === 'con') consA.push(item.text);
    } else {
      if (item.type === 'pro') prosB.push(item.text);
      if (item.type === 'con') consB.push(item.text);
    }
  }

  let recommendedOption;
  const margin = Math.abs(scoreA - scoreB);
  const closeCall = margin > 0 && margin <= 3;

  if (scoreA > scoreB) {
    recommendedOption = 'Option A';
  } else if (scoreB > scoreA) {
    recommendedOption = 'Option B';
  } else {
    recommendedOption = 'Tie';
  }

  if (recommendedOption === 'Tie' && userPreference === 'A') {
    recommendedOption = 'Option A';
  } else if (recommendedOption === 'Tie' && userPreference === 'B') {
    recommendedOption = 'Option B';
  } else if (closeCall && userPreference === 'A' && scoreA >= scoreB) {
    recommendedOption = 'Option A';
  } else if (closeCall && userPreference === 'B' && scoreB >= scoreA) {
    recommendedOption = 'Option B';
  }

  let winningPros;
  let winningCons;
  let winningLabel;
  let losingLabel;

  if (recommendedOption === 'Option A') {
    winningPros = prosA;
    winningCons = consA;
    winningLabel = 'Option A';
    losingLabel = 'Option B';
  } else if (recommendedOption === 'Option B') {
    winningPros = prosB;
    winningCons = consB;
    winningLabel = 'Option B';
    losingLabel = 'Option A';
  } else {
    winningPros = [];
    winningCons = [];
    winningLabel = 'Neither option';
    losingLabel = '';
  }

  const leaning =
    emotionalWeight > practicalWeight
      ? 'Emotional'
      : practicalWeight > emotionalWeight
        ? 'Practical'
        : 'Balanced';

  const formulaA = formatScoreFormula(breakdown.optionA);
  const formulaB = formatScoreFormula(breakdown.optionB);

  let reasoning;
  if (recommendedOption === 'Tie') {
    reasoning = `Both options score ${scoreA} points (Option A: ${formulaA}; Option B: ${formulaB}). Each star you gave adds that many points for pros and subtracts for cons — so equal totals mean both sides balance out.`;
  } else {
    const winB = recommendedOption === 'Option A' ? breakdown.optionA : breakdown.optionB;
    const loseB = recommendedOption === 'Option A' ? breakdown.optionB : breakdown.optionA;
    reasoning = `${winningLabel} leads ${scoreA > scoreB ? scoreA : scoreB} to ${scoreA > scoreB ? scoreB : scoreA} points. `;
    reasoning += `${winningLabel}: ${formatScoreFormula(winB)}. `;
    reasoning += `${losingLabel}: ${formatScoreFormula(loseB)}. `;
    reasoning += 'Every star counts as one point — pros add, cons subtract. ';
  }

  if (winningPros.length > 0) {
    reasoning += `Strongest plus: "${winningPros[0]}". `;
  }
  if (winningCons.length > 0) {
    reasoning += `Biggest trade-off: "${winningCons[0]}". `;
  }
  if (closeCall && recommendedOption !== 'Tie') {
    reasoning += 'Scores are very close — feelings and values may tip the scale. ';
  }
  if (mindset?.innerConflict) {
    reasoning += `You named inner tension — that still matters alongside the numbers. `;
  }

  let winner;
  if (scoreA > scoreB) winner = 'A';
  else if (scoreB > scoreA) winner = 'B';
  else winner = 'Tie';

  return {
    recommendedOption,
    emotionalVsPractical: leaning,
    reasoning,
    scores: {
      optionA: scoreA,
      optionB: scoreB,
    },
    scoreBreakdown: breakdown,
    scoreA,
    scoreB,
    winner,
    prosA,
    prosB,
    isCloseCall: closeCall,
  };
}

module.exports = analyzeDecision;
