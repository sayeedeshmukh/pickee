export const UNCLEAR_INPUT_MESSAGE = 'Your input is not clear. Please provide more details.';

export function isClearText(value, { minChars = 3 } = {}) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length < minChars) return false;
  // Avoid "clear text" that is only punctuation/symbols.
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

