import Business from "../models/business.model.js";
import ExistingBusiness from "../models/existingbusiness.model.js";
import Financial from "../models/financial.model.js";
import SWOT from "../models/swot.model.js";
import MarketResearch from "../models/marketResearch.model.js";
import BusinessMetric from "../models/businessMetric.model.js";
import Report from "../models/report.model.js";
import { calculateScore, generateAnalysis } from "../services/analysis.service.js";
import { analyzeStartup } from "../services/aiServices.js";

export const addFinancial = async (req, res) => {
  try {
    // Sequelize: FK field is 'businessId' (integer), not Mongoose 'business' (ObjectId)
    const financial = await Financial.create({
      businessId: req.params.businessId,
      ...req.body,
    });

    res.status(201).json(financial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSWOT = async (req, res) => {
  try {
    const swot = await SWOT.create({
      businessId: req.params.businessId,
      ...req.body,
    });

    res.status(201).json(swot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMarketResearch = async (req, res) => {
  try {
    const market = await MarketResearch.create({
      businessId: req.params.businessId,
      ...req.body,
    });

    res.status(201).json(market);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMetrics = async (req, res) => {
  try {
    const metrics = await BusinessMetric.create({
      businessId: req.params.businessId,
      ...req.body,
    });

    res.status(201).json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalysis = async (req, res) => {
  try {
    const data = req.body;
    const result = calculateScore(data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const analyzeBusiness = async (req, res) => {
  try {
    const result = calculateScore(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/analysis/:id
 * Fetches full analysis for a business or idea report by ID
 */
export const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Try finding Report directly by primary key (Sequelize: findByPk)
    let report = await Report.findByPk(id);
    if (report) {
      return res.json(report);
    }

    // 2. Try finding Business or ExistingBusiness by PK
    let business = await Business.findByPk(id);
    if (!business) {
      business = await ExistingBusiness.findByPk(id);
    }
    if (!business) {
      return res.status(404).json({ message: "Business analysis not found" });
    }

    // Gather associated records (Sequelize: findOne with where clause)
    const financial = await Financial.findOne({ where: { businessId: id } });
    const swot      = await SWOT.findOne({ where: { businessId: id } });
    const market    = await MarketResearch.findOne({ where: { businessId: id } });
    const metrics   = await BusinessMetric.findOne({ where: { businessId: id } });

    const businessData = {
      businessName: business.businessName || business.brandName || "Business",
      financial,
      swot,
      marketResearch: market,
      metrics,
    };

    // Calculate score
    const heuristicAnalysis = generateAnalysis(businessData);

    const fullResponse = {
      id: business.id,   // Sequelize uses .id not ._id
      businessName: business.businessName || business.brandName || "Business",
      score: {
        total: heuristicAnalysis.score,
        grade: heuristicAnalysis.score >= 80 ? "A" : heuristicAnalysis.score >= 60 ? "B" : "C",
        verdict: heuristicAnalysis.recommendation,
        clarity: 80,
        uniqueness: 75,
        market_opportunity: 78,
        competitive_position: 70,
        execution_readiness: 82,
      },
      nlp: {
        clarity_score:   80,
        uniqueness_score: 75,
      },
      risk: {
        tier: heuristicAnalysis.score >= 70 ? "Low" : "Medium",
        overall_risk_score: 100 - heuristicAnalysis.score,
      },
      vc_readiness: {
        score: heuristicAnalysis.score,
        tier:  heuristicAnalysis.score >= 75 ? "VC Ready" : "Early Stage",
      },
      market: {
        industry: business.industry || "General",
        global_market_size_usd_bn: 15.0,
        cagr_percent: 12.5,
        top_trends: ["Digital Transformation", "Scalable Operations"],
      },
      insights: {
        recommendation: heuristicAnalysis.recommendation,
        strengths:      heuristicAnalysis.analysis.strengths,
        weaknesses:     heuristicAnalysis.analysis.weaknesses,
        opportunities:  heuristicAnalysis.analysis.opportunities,
        threats:        heuristicAnalysis.analysis.threats,
      },
    };

    return res.json(fullResponse);
  } catch (error) {
    console.error("[getAnalysisById] Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};