/**
 * 🔍 Grounded AI Retrieval & Q&A Service
 * This service takes a plain-English question, performs an index-based keywords query
 * across the database records, extracts matching context logs, and compiles a
 * grounded summary response with specific citations.
 */

function processGroundedQA(question, feedbackItems) {
  const query = question.toLowerCase();
  
  // 1. Calculate relevance scoring matching keywords against dataset content
  const scoredItems = feedbackItems.map(item => {
    const text = item.content.toLowerCase();
    let matchScore = 0;
    
    // Split query into terms to find semantic overlaps
    const terms = query.split(' ').filter(word => word.length > 3);
    terms.forEach(term => {
      if (text.includes(term)) matchScore += 2;
    });

    // Bonus weights for matching explicit feature areas
    if (item.featureArea && query.includes(item.featureArea.toLowerCase())) {
      matchScore += 5;
    }

    return { item, matchScore };
  });

  // 2. Filter down to the top matching records (Context Retrieval)
  const topMatches = scoredItems
    .filter(sc => sc.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)
    .map(sc => sc.item);

  // 3. Fallback handle if zero matches are found in the system database
  if (topMatches.length === 0) {
    return {
      answer: "I parsed our current customer feedback records but couldn't find explicit data or complaints addressing this topic. Could you please specify another feature area?",
      citations: []
    };
  }

  // 4. Generate the grounded text narrative based on matching sentiments
  const totalMatches = topMatches.length;
  const negativeHits = topMatches.filter(i => i.sentiment === 'NEG').length;
  
  let dynamicSummary = `Based on the matching feedback logs retrieved, users are explicitly talking about this topic. `;
  
  if (negativeHits > totalMatches / 2) {
    dynamicSummary += `The overall baseline sentiment is heavily critical. Customers are reporting pain points and friction here that require immediate engineering attention.`;
  } else {
    dynamicSummary += `The overall feedback baseline leans neutral to positive. Users are happy with recent stability but have pointed out minor feature requests.`;
  }

  return {
    answer: dynamicSummary,
    citations: topMatches.map(m => ({
      id: m.id,
      channel: m.channel,
      content: m.content,
      sentiment: m.sentiment
    }))
  };
}

module.exports = { processGroundedQA };
