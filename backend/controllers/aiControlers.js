import { analyzeStartup } from "../services/aiServices.js";

/**
 * POST /api/ai/analyze & POST /api/ai/analyze-idea
 * Body: { idea: string, groq_api_key?: string }
 */
export const analyzeIdea = async (req, res) => {
  const idea = typeof req.body === "string" ? req.body : req.body?.idea || req.body?.description;
  const groqApiKey = req.body?.groq_api_key;

  if (!idea || typeof idea !== "string" || idea.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: "Startup idea text is required and must be at least 10 characters.",
    });
  }

  try {
    const result = await analyzeStartup(idea.trim(), groqApiKey || null);
    // Return both top-level and data-nested for frontend compatibility
    return res.status(200).json({
      success: true,
      data: result,
      ...result
    });
  } catch (error) {
    console.error("[analyzeIdea] Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message || "AI analysis failed. Please try again.",
    });
  }
};

/**
 * POST /api/ai/analyze-existing
 * Body: { business: object }
 */
export const analyzeExistingBusiness = async (req, res) => {
  try {
    const business = req.body;
    const ideaSummary = typeof business === "string" 
      ? business 
      : `Business: ${business.businessName || ''}, Industry: ${business.industry || ''}, Details: ${business.extractedData || JSON.stringify(business)}`;

    const result = await analyzeStartup(ideaSummary);
    return res.status(200).json({
      success: true,
      data: result,
      ...result
    });
  } catch (error) {
    console.error("[analyzeExistingBusiness] Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message || "Existing business analysis failed.",
    });
  }
};

export default analyzeIdea;