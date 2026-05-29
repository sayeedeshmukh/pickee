/**
 * ORICA decision scoring — linear star points.
 * Each star = 1 point (1★ → 1 … 5★ → 5).
 * Per option: net = (sum of pro stars) − (sum of con stars).
 */

function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isPlaceholderOrVague(text) {
  const t = (text || '').trim().toLowerCase();
  if (t.length < 4) return true;
  const vaguePatterns = [
    /^add a (pro|con)/,
    /^think how/,
    /^what would you gain/,
    /^what does .+ lose/,
    /^trade-off of/,
    /placeholder/i,
    /^n\/?a$/,
    /^\.+$/,
    /^x+$/,
    /^test$/,
    /^asdf/,
    /^lorem/,
  ];
  return vaguePatterns.some((p) => p.test(t));
}

/** 1–5 star → 1–5 points (clamped). */
function starPoints(rating) {
  const r = Number(rating);
  if (!Number.isFinite(r)) return 1;
  return Math.max(1, Math.min(5, Math.round(r)));
}

/**
 * Signed contribution for one item (pro +N, con −N).
 */
function getItemContribution(rating, type) {
  const points = starPoints(rating);
  return type === 'pro' ? points : -points;
}

function emptyBreakdown() {
  return { proPoints: 0, conPoints: 0, proCount: 0, conCount: 0 };
}

/**
 * Deduplicate by normalized text per option+type; keep highest-rated version.
 */
function dedupeProsCons(prosCons) {
  const seen = new Map();
  for (const item of prosCons || []) {
    if (!item || (item.option !== 'A' && item.option !== 'B')) continue;
    if (!['pro', 'con'].includes(item.type)) continue;
    if (isPlaceholderOrVague(item.text)) continue;

    const key = `${item.option}|${item.type}|${normalizeText(item.text)}`;
    const existing = seen.get(key);
    if (!existing || starPoints(item.rating) > starPoints(existing.rating)) {
      seen.set(key, item);
    }
  }
  return [...seen.values()];
}

function computeWeightedScores(prosCons) {
  const items = dedupeProsCons(prosCons);
  const breakdown = {
    A: emptyBreakdown(),
    B: emptyBreakdown(),
  };

  let scoreA = 0;
  let scoreB = 0;
  let emotionalWeight = 0;
  let practicalWeight = 0;

  for (const item of items) {
    const points = starPoints(item.rating);
    const delta = item.type === 'pro' ? points : -points;
    const bucket = breakdown[item.option];

    if (item.type === 'pro') {
      bucket.proPoints += points;
      bucket.proCount += 1;
    } else {
      bucket.conPoints += points;
      bucket.conCount += 1;
    }

    if (item.option === 'A') scoreA += delta;
    else scoreB += delta;

    if (points >= 4) {
      if (item.type === 'pro') practicalWeight += 1;
      else emotionalWeight += 1;
    }
  }

  const optionA = {
    ...breakdown.A,
    net: breakdown.A.proPoints - breakdown.A.conPoints,
  };
  const optionB = {
    ...breakdown.B,
    net: breakdown.B.proPoints - breakdown.B.conPoints,
  };

  return {
    scoreA,
    scoreB,
    emotionalWeight,
    practicalWeight,
    scoredItems: items,
    breakdown: { optionA, optionB },
  };
}

/**
 * Human-readable formula line for one option.
 */
function formatScoreFormula(b) {
  if (!b) return '';
  const { proPoints, conPoints, net } = b;
  if (proPoints === 0 && conPoints === 0) return 'No rated pros or cons yet.';
  return `+${proPoints} from pros − ${conPoints} from cons = ${net} point${net === 1 ? '' : 's'}`;
}

module.exports = {
  normalizeText,
  isPlaceholderOrVague,
  dedupeProsCons,
  computeWeightedScores,
  getItemContribution,
  starPoints,
  formatScoreFormula,
};
