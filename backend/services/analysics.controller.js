import Financial from "../models/financial.model.js";
import BusinessMetric from "../models/businessMetric.model.js";
import { calculateBusinessScore } from "../services/score.service.js";

export const generateAnalysis = async (req, res) => {
  try {
    const financial = await Financial.findOne({
      business: req.params.businessId
    });

    const metrics = await BusinessMetric.findOne({
      business: req.params.businessId
    });

    if (!financial || !metrics) {
      return res.status(400).json({
        message: "Incomplete data for analysis"
      });
    }

    const result = calculateBusinessScore({ financial, metrics });

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const calculateScore = (data) => {

  let score = 0;

  // 💰 Financial
  if (Number(data.revenue) > Number(data.expenses)) score += 25;

  // 📊 Market
  if (Number(data.marketSize) > 100000) score += 20;

  // 📈 Metrics
  if (Number(data.ltv) > Number(data.cac)) score += 20;

  // ⚖️ SWOT
  if (data.strengths) score += 10;
  if (data.opportunities) score += 10;

  // 🧠 Competitor
  if (data.competitorWeakness) score += 5;

  // 🎯 Normalize
  if (score > 100) score = 100;

  // 🚨 Risk
  let risk = "High";

  if (score >= 70) risk = "Low";
  else if (score >= 40) risk = "Medium";

  // 🤖 AI Insights
  const insights = [];

  if (data.ltv > data.cac)
    insights.push("Strong unit economics (LTV > CAC)");

  if (data.revenue > data.expenses)
    insights.push("Business is profitable");

  if (data.marketSize > 100000)
    insights.push("Large market opportunity");

  if (data.churnRate > 10)
    insights.push("High churn rate, improve retention");

  return { score, risk, insights };
};