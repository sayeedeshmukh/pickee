function analyzeDecision({ prosCons }) {
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

    // --- Decide which option is better ---
    let recommendedOption = scoreA > scoreB ? 'Option A' : 'Option B';
    let leaning = emotionalWeight > practicalWeight ? 'Emotional' :
                practicalWeight > emotionalWeight ? 'Practical' : 'Balanced';

    // --- Generate reasoning ---
    let reasoning = '';
    if (leaning === 'Emotional') {
        reasoning = 'The cons suggest emotional factors might be influencing this decision.';
    } else if (leaning === 'Practical') {
        reasoning = 'The pros suggest this is the more practical choice.';
    } else {
        reasoning = 'The decision appears balanced between practical and emotional factors.';
    }

    return {
        recommendedOption,
        emotionalVsPractical: leaning,
        reasoning,
        scores: {
            optionA: scoreA,
            optionB: scoreB
        }
    };
}

module.exports = analyzeDecision;