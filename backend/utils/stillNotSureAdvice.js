/**
 * Builds personalized "Still Not Sure?" advice from every form field.
 */

function detectMindset(allText, scoreAnalysisLean) {
  const text = (allText || '').toLowerCase();

  if (/logic|practical|reason|rational|fact|objective|analysis|research|data|pros and cons|list|compare/i.test(text)) {
    return 'Logical';
  }
  if (/emotion|feel|gut|intuition|heart|love|hate|fear|anxiety|worry|stress|anxious|overwhelmed|passion|attachment/i.test(text)) {
    return 'Emotional';
  }
  if (scoreAnalysisLean === 'Practical') return 'Logical';
  if (scoreAnalysisLean === 'Emotional') return 'Emotional';
  return 'Balanced';
}

function getBaseAdvice(mindset) {
  if (mindset === 'Logical') {
    return (
      "You're thinking logically and practically. This is great for making well-reasoned decisions!\n\n" +
      "- You're focusing on facts, data, and practical outcomes\n" +
      "- You're considering long-term consequences and feasibility\n" +
      "- You're being objective and systematic in your approach\n\n" +
      "Tip: While logic is excellent, don't forget to check in with your feelings. " +
      "Imagine choosing each option — how do you feel afterward?"
    );
  }
  if (mindset === 'Emotional') {
    return (
      "You're thinking emotionally and intuitively. That's valid and important.\n\n" +
      "- You're listening to feelings and gut instincts\n" +
      "- You're weighing emotional well-being\n" +
      "- You're being true to what matters to you\n\n" +
      "Tip: Emotions are valuable guides — also check practical factors you might be overlooking."
    );
  }
  return (
    "Your mindset seems balanced between logic and emotion — a strong place for deciding.\n\n" +
    "- You're weighing both facts and feelings\n" +
    "- You're being thoughtful and comprehensive\n\n" +
    "Tip: If still unsure, picture yourself after each choice. Which future feels more right?"
  );
}

function buildStillNotSureAdvice({ form, decision, scoreAnalysis }) {
  const allText = [form.feelings, form.missingInfo, form.helpNeeded, form.extra]
    .filter(Boolean)
    .join(' ');

  const detected = detectMindset(allText, scoreAnalysis?.emotionalVsPractical);
  let advice = getBaseAdvice(detected);

  const titleA = decision.optionA.title;
  const titleB = decision.optionB.title;
  const prefTitle = form.userPreference === 'A' ? titleA : titleB;
  const confidence = Number(form.confidence);

  advice += '\n\n---\n\nBased on what you told us:\n';
  advice += `\n- How you feel: ${form.feelings}`;
  if (form.missingInfo?.trim()) {
    advice += `\n- Information you wish you had: ${form.missingInfo}`;
    advice += `\n  - Try to get this before deciding — even one concrete fact can help.`;
  }
  advice += `\n- Confidence: ${confidence}/10`;
  if (form.helpNeeded?.trim()) {
    advice += `\n- What would help you decide: ${form.helpNeeded}`;
  }
  if (form.extra?.trim()) {
    advice += `\n- Also on your mind: ${form.extra}`;
  }
  advice += `\n- If you had to choose now, you'd lean toward: **${prefTitle}** (Option ${form.userPreference})`;

  if (scoreAnalysis?.scores) {
    const { optionA: scoreA, optionB: scoreB } = scoreAnalysis.scores;
    const winner = scoreAnalysis.winner;
    if (winner && winner !== 'Tie') {
      const ratedTitle = winner === 'A' ? titleA : titleB;
      if (winner !== form.userPreference) {
        advice +=
          `\n\nNote: Your **ratings** favor "${ratedTitle}" (${scoreA} vs ${scoreB} importance points), ` +
          `but your **gut** leans toward "${prefTitle}". Explore what's pulling you away from the higher-scored option — ` +
          'often it\'s fear, attachment, or missing info you listed above.';
      } else {
        advice +=
          `\n\nYour gut lean and your ratings both point toward **"${prefTitle}"** (${scoreA} vs ${scoreB}). ` +
          'That alignment is a strong signal — review the cons once more, then trust your process.';
      }
    } else if (winner === 'Tie') {
      advice +=
        `\n\nYour ratings are tied (${scoreA} vs ${scoreB}), while you lean toward **"${prefTitle}"**. ` +
        'Use your gut lean as a tiebreaker, or adjust ratings if any factor feels underweighted.';
    }
  }

  if (confidence <= 4) {
    advice +=
      `\n\nLow confidence (${confidence}/10): don't rush. ` +
      (form.helpNeeded?.trim()
        ? `You said "${form.helpNeeded}" would help — prioritize that first.`
        : 'Gather the missing information you mentioned, or talk it through with someone you trust.');
  } else if (confidence >= 8) {
    advice +=
      `\n\nYou're fairly confident (${confidence}/10). ` +
      'Do a final check on the cons for your preferred option — high confidence is good, but blind spots still happen.';
  } else {
    advice +=
      `\n\nModerate confidence (${confidence}/10): ` +
      (form.helpNeeded?.trim()
        ? `focus on "${form.helpNeeded}" to move the needle.`
        : 'list the one thing that would make you 2 points more confident, then act on it.');
  }

  const emotionalDecisionKeywords =
    /love|hate|heart|gut feeling|intuition|feels right|feels wrong|emotional attachment|passion|desire/i;
  const emotionalInstabilityKeywords =
    /anxious|worried|stressed|overwhelmed|confused|fear|panic|doubt|uncertain|emotional instability|emotional breakdown/i;

  if (
    emotionalDecisionKeywords.test(allText) &&
    emotionalInstabilityKeywords.test(allText)
  ) {
    advice +=
      '\n\nImportant: You sound emotionally charged right now. Your feelings are valid, but big decisions made in peak stress often get reversed later. ' +
      'Sleep on it, focus on facts you listed as missing, and ask what you\'d tell a friend in the same spot.';
  }

  return { detectedMindset: detected, advice };
}

module.exports = { buildStillNotSureAdvice, detectMindset };
