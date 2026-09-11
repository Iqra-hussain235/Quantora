import axios from "axios";

const PYTHON_AI_URL = process.env.PYTHON_AI_URL || "http://localhost:8000";

/**
 * Sends startup idea text to Python FastAPI AI engine (:8000/analyze).
 * If Python engine is not running, falls back automatically to direct Groq Cloud LLaMA 3.1 analysis.
 *
 * @param {string} idea - The startup idea text
 * @param {string} [groqApiKey] - Optional Groq API key
 * @returns {Promise<object>} Full analysis response
 */
export const analyzeStartup = async (idea, groqApiKey = null) => {
  const apiKey = groqApiKey || process.env.GROQ_API_KEY;

  // 1. Try Python FastAPI AI Engine first
  try {
    const payload = { idea };
    if (apiKey) payload.groq_api_key = apiKey;

    const response = await axios.post(`${PYTHON_AI_URL}/analyze`, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 120_000,
    });

    return response.data;
  } catch (pythonErr) {
    // If Python server is not reachable, gracefully fallback to direct Groq LLM
    if (pythonErr.code === "ECONNREFUSED" || pythonErr.code === "ENOTFOUND") {
      console.warn(`[aiServices] Python AI engine offline at ${PYTHON_AI_URL}. Executing direct Groq AI fallback.`);
      return await directGroqFallbackAnalysis(idea, apiKey);
    }

    const detail = pythonErr.response?.data?.detail || pythonErr.message;
    console.error("[aiServices] Python AI error:", detail);
    throw new Error(detail);
  }
};

/**
 * Direct Groq LLM fallback for instant intelligent analysis
 */
const directGroqFallbackAnalysis = async (idea, apiKey) => {
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured on the server. Please set GROQ_API_KEY in backend/.env.");
  }

  const prompt = `You are a top-tier venture capital partner and startup viability analyst.
Analyze the following startup idea and return ONLY a valid JSON object (no markdown, no backticks, no extra text):

STARTUP IDEA:
"${idea}"

Required JSON format:
{
  "idea": "${idea.replace(/"/g, "'")}",
  "processing_time_seconds": 1.5,
  "dynamic_mode": true,
  "score": {
    "total": 82,
    "grade": "A-",
    "verdict": "Strong Market Potential",
    "clarity": 85,
    "uniqueness": 78,
    "market_opportunity": 84,
    "competitive_position": 76,
    "execution_readiness": 80
  },
  "nlp": {
    "clarity_score": 85,
    "uniqueness_score": 78
  },
  "insights": {
    "summary": "<2-3 sentence executive summary of value prop>",
    "target_audience": "<key customer segments>",
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "weaknesses": ["<weakness 1>", "<weakness 2>"],
    "actionable_recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
  },
  "market": {
    "industry": "<Identified Industry>",
    "global_market_size_usd_bn": 18.5,
    "cagr_percent": 15.2,
    "investor_interest": "High",
    "vc_activity": "Active",
    "key_players": ["<Competitor 1>", "<Competitor 2>", "<Competitor 3>"],
    "top_trends": ["<Trend 1>", "<Trend 2>", "<Trend 3>"],
    "market_summary": "<Market analysis summary>"
  },
  "competitors": {
    "direct_competitors": [
      { "name": "<Competitor A>", "market_share": "20%", "strengths": ["<Strength>"], "weaknesses": ["<Weakness>"] },
      { "name": "<Competitor B>", "market_share": "15%", "strengths": ["<Strength>"], "weaknesses": ["<Weakness>"] }
    ],
    "differentiation_points": ["<Unique differentiator 1>", "<Unique differentiator 2>"]
  },
  "growth": {
    "tam_usd_bn": 18.5,
    "sam_usd_bn": 4.8,
    "som_usd_bn": 1.2
  },
  "risk": {
    "tier": "Medium",
    "overall_risk_score": 35,
    "market_risk": "Moderate market adoption friction",
    "execution_risk": "Go-to-market and customer acquisition",
    "mitigation_strategies": ["Execute focused pilot programs", "Build strong channel partnerships"]
  },
  "vc_readiness": {
    "score": 80,
    "tier": "Seed / Series A Ready",
    "pitch_strength": "High",
    "fundability": "Attractive for early-stage VC funds"
  }
}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[aiServices] Groq fallback failed:", response.status, errText);
      throw new Error(`Groq API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(rawContent);
    return parsed;
  } catch (err) {
    console.error("[aiServices] Direct Groq fallback error:", err.message);
    throw new Error(`AI Analysis failed: ${err.message}`);
  }
};