export const UNCLEAR_INPUT_MESSAGE = 'Your input is not clear. Please provide more details.';

const VAGUE_PATTERNS = [
  /^add a (pro|con)/i,
  /^think how/i,
  /^what would you gain/i,
  /^idk$/i,
  /^i don'?t know$/i,
  /^nothing$/i,
  /^n\/?a$/i,
  /^\.+$/,
  /^asdf/i,
];

export function isVagueText(value) {
  const trimmed = (typeof value === 'string' ? value : '').trim();
  if (trimmed.length < 4) return true;
  return VAGUE_PATTERNS.some((p) => p.test(trimmed));
}

export function isClearText(value, { minChars = 3 } = {}) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length < minChars) return false;
  if (isVagueText(trimmed)) return false;
  return /[A-Za-z0-9]/.test(trimmed);
}

/**
 * Validates "clarity" for free-text inputs.
 * @returns {boolean} true if clear enough, otherwise false (and calls onError if provided).
 */
export function requireClearText(value, { minChars = 3, message = UNCLEAR_INPUT_MESSAGE, onError } = {}) {
  if (isClearText(value, { minChars })) return true;
  if (typeof onError === 'function') onError(message);
  return false;
}

export function getDecisionDisplayTitle(decision) {
  if (!decision) return 'Your decision';
  const a = decision.optionA?.title?.trim();
  const b = decision.optionB?.title?.trim();
  if (a && b) return `${a} vs ${b}`;
  return a || b || 'Your decision';
}
