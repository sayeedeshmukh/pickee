function formatMindsetForPrompt(mindset) {
  if (!mindset) return '';

  const lines = [];

  const driverMap = {
    fear: 'They are driven more by avoiding a bad outcome than chasing a dream.',
    desire: 'They are pulled toward something they want, not just running from risk.',
    both: 'Both fear and desire are active — they feel pulled and pushed at once.',
  };
  if (mindset.primaryDriver) {
    lines.push(driverMap[mindset.primaryDriver] || `Primary driver: ${mindset.primaryDriver}`);
  }

  const styleMap = {
    logic: 'They tend to decide with spreadsheets, facts, and pros/cons lists.',
    emotion: 'Gut feeling, relationships, and vibes weigh heavily for them.',
    mixed: 'Head and heart are both in the room — they may feel torn between them.',
  };
  if (mindset.thinkingStyle) {
    lines.push(styleMap[mindset.thinkingStyle] || `Thinking style: ${mindset.thinkingStyle}`);
  }

  if (mindset.longTermOutlook) {
    lines.push(`Long-term fulfillment: ${mindset.longTermOutlook}`);
  }
  if (mindset.externalPressure) {
    lines.push(`External pressure: ${mindset.externalPressure}`);
  }
  if (mindset.valuesThatMatter) {
    lines.push(`Values that matter: ${mindset.valuesThatMatter}`);
  }
  if (mindset.fearIfWrong) {
    lines.push(`Fear if they choose wrong: ${mindset.fearIfWrong}`);
  }
  if (mindset.hopeIfRight) {
    lines.push(`Hope if they choose right: ${mindset.hopeIfRight}`);
  }
  if (mindset.whoIsInfluencing) {
    lines.push(`Who/what is influencing them: ${mindset.whoIsInfluencing}`);
  }
  if (mindset.innerConflict) {
    lines.push(`Inner conflict: ${mindset.innerConflict}`);
  }
  if (mindset.anythingElse) {
    lines.push(`Additional context: ${mindset.anythingElse}`);
  }

  return lines.length ? lines.join('\n') : '';
}

module.exports = { formatMindsetForPrompt };
