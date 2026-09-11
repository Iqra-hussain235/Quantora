// Analysis Service Functions

export const calculateScore = (data) => {
  // Basic scoring algorithm - you can enhance this
  let score = 0;

  // Financial scoring
  if (data.financial) {
    const { revenue, expenses, profit } = data.financial;
    if (profit > 0) score += 30;
    if (revenue > expenses) score += 20;
  }

  // SWOT scoring
  if (data.swot) {
    const { strengths, weaknesses, opportunities, threats } = data.swot;
    score += Math.min(strengths?.length * 5 || 0, 20);
    score += Math.min(opportunities?.length * 5 || 0, 20);
  }

  // Market research scoring
  if (data.marketResearch) {
    const { marketSize, competition, targetAudience } = data.marketResearch;
    if (marketSize > 1000000) score += 15;
    if (competition < 5) score += 15;
  }

  return Math.min(score, 100); // Max score 100
};

export const generateAnalysis = (businessData) => {
  const score = calculateScore(businessData);

  let recommendation = "";
  if (score >= 80) {
    recommendation = "Excellent business potential! Proceed with confidence.";
  } else if (score >= 60) {
    recommendation = "Good potential with some areas for improvement.";
  } else if (score >= 40) {
    recommendation = "Moderate potential. Consider addressing key weaknesses.";
  } else {
    recommendation = "High risk. Significant improvements needed.";
  }

  return {
    score,
    recommendation,
    analysis: {
      strengths: businessData.swot?.strengths || [],
      weaknesses: businessData.swot?.weaknesses || [],
      opportunities: businessData.swot?.opportunities || [],
      threats: businessData.swot?.threats || []
    }
  };
};