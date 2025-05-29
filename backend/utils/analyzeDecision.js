
function analyzeDecision({ mindset, prosCons }) {
    let scoreA = 0;
    let scoreB = 0;
    let emotionalWeight = 0;
    let practicalWeight = 0;

  // --- 1. Add up ratings for pros/cons ---
    for (const item of prosCons) {
    if (item.option === 'A') {
        scoreA += item.rating;
    } else if (item.option === 'B') {
        scoreB += item.rating;
    }

    if (item.type === 'pro' && item.rating >= 7) {
        practicalWeight += 1;
    } else if (item.type === 'con' && item.rating >= 7) {
        emotionalWeight += 1;
    }
    }

  // to analyze mindset
    if (mindset.emotionalAttachment === 'Strong') emotionalWeight += 2;
    if (mindset.fearOfRegret === 'High') emotionalWeight += 1;
    if (mindset.longTermThinking === 'Yes') practicalWeight += 2;
    if (mindset.practicalApproach === 'Always') practicalWeight += 1;

  // to decide which option is better
    let recommendedOption = scoreA > scoreB ? 'Option A' : 'Option B';
    let leaning = emotionalWeight > practicalWeight ? 'Emotional' :
                practicalWeight > emotionalWeight ? 'Practical' : 'Balanced';

  // --- 4. Generate reasoning ---
    let reasoning = '';
    if (leaning === 'Emotional') {
    reasoning = 'You seem emotionally connected to this choice. It might feel right in your heart.';
    } else if (leaning === 'Practical') {
    reasoning = 'Your mindset and pros/cons suggest a practical decision is better long-term.';
    } else {
    reasoning = 'Both your heart and mind are aligned on this choice.';
    }

    return {
    recommendedOption,
    emotionalVsPractical: leaning,
    reasoning
    };
}

module.exports = analyzeDecision;
