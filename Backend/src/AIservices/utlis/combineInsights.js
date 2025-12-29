function combineInsights(insightsArray, maxLength = 800) {
  const combined = insightsArray.join("\n");

  return combined.length > maxLength
    ? combined.slice(0, maxLength)
    : combined;
}

module.exports = combineInsights;
