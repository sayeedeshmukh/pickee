function analyzeDecision({ prosCons }) {
    let scoreA = 0;
    let scoreB = 0;
    let emotionalWeight = 0;
    let practicalWeight = 0;
    let prosA = [];
    let consA = [];
    let prosB = [];
    let consB = [];

    // --- 1. Add up ratings for pros/cons and collect reasons ---
    for (const item of prosCons) {
        if (item.option === 'A') {
            scoreA += item.rating;
            if (item.type === 'pro') prosA.push(item.text);
            if (item.type === 'con') consA.push(item.text);
        } else if (item.option === 'B') {
            scoreB += item.rating;
            if (item.type === 'pro') prosB.push(item.text);
            if (item.type === 'con') consB.push(item.text);
        }

        if (item.type === 'pro' && item.rating >= 7) {
            practicalWeight += 1;
        } else if (item.type === 'con' && item.rating >= 7) {
            emotionalWeight += 1;
        }
    }

    // --- Decide which option is better (always by score) ---
    let recommendedOption = scoreA > scoreB ? 'Option A' : 'Option B';
    let winningPros, winningCons, losingPros, losingCons, winningLabel, losingLabel;
    if (recommendedOption === 'Option A') {
        winningPros = prosA; winningCons = consA; losingPros = prosB; losingCons = consB;
        winningLabel = 'Option A'; losingLabel = 'Option B';
    } else {
        winningPros = prosB; winningCons = consB; losingPros = prosA; losingCons = consA;
        winningLabel = 'Option B'; losingLabel = 'Option A';
    }

    let leaning = emotionalWeight > practicalWeight ? 'Emotional' :
                practicalWeight > emotionalWeight ? 'Practical' : 'Balanced';

    // --- Generate personal, motivational reasoning ---
    let reasoning = `Based on your ratings, ${winningLabel} stands out as the stronger choice for you right now. `;
    if (winningPros.length > 0) {
        reasoning += `What really makes this option shine is: "${winningPros[0]}"`;
        if (winningPros.length > 1) reasoning += `, and also: "${winningPros[1]}"`;
        reasoning += '. ';
    }
    if (winningCons.length > 0) {
        reasoning += `Of course, every choice has its challenges, like: "${winningCons[0]}". But your overall ratings show you believe the positives outweigh the negatives.`;
    }
    reasoning += ` Remember, this isn't just about logic—it's about what feels right for you. Trust your process and take pride in making a thoughtful decision!`;

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