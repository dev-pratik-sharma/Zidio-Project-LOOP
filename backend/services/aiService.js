/**
 * 🔮 High-Speed Rule-Based AI Classification Service
 * This service runs lightning-fast local text analysis to determine sentiment 
 * and filter keywords into relevant categories without relying on external APIs.
 */

function analyzeFeedback(text) {
  const content = text.toLowerCase();
  let sentiment = 'NEU'; // Default to Neutral
  let sentimentScore = 0.0;

  // 1. Keyword Weight Matrix Analytics
  const negativeKeywords = ['slow', 'crash', 'bug', 'error', 'fail', 'broken', 'worst', 'hate', 'expensive', 'timeout'];
  const positiveKeywords = ['love', 'awesome', 'great', 'gorgeous', 'fast', 'amazing', 'perfect', 'saved', 'helpful', 'clean'];

  let negCount = 0;
  let posCount = 0;

  negativeKeywords.forEach(word => { if (content.includes(word)) negCount++; });
  positiveKeywords.forEach(word => { if (content.includes(word)) posCount++; });

  // 2. Sentiment Score Engine Computation
  if (negCount > posCount) {
    sentiment = 'NEG';
    sentimentScore = -Math.min(0.1 * negCount, 1.0);
  } else if (posCount > negCount) {
    sentiment = 'POS';
    sentimentScore = Math.min(0.1 * posCount, 1.0);
  }

  // 3. Feature Area Tagging Classifier
  let featureArea = 'General';
  if (content.includes('onboarding') || content.includes('sign up') || content.includes('register') || content.includes('login')) {
    featureArea = 'Onboarding & Auth';
  } else if (content.includes('speed') || content.includes('loading') || content.includes('performance') || content.includes('lag')) {
    featureArea = 'Performance';
  } else if (content.includes('billing') || content.includes('invoice') || content.includes('price') || content.includes('pay')) {
    featureArea = 'Billing & Payments';
  } else if (content.includes('dashboard') || content.includes('chart') || content.includes('visual') || content.includes('ui')) {
    featureArea = 'UI/UX Dashboard';
  }

  return {
    sentiment,
    sentimentScore: parseFloat(sentimentScore.toFixed(2)),
    featureArea
  };
}

module.exports = { analyzeFeedback };
