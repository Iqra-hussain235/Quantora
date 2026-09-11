import express from "express";
import {
  addFinancial,
  addSWOT,
  addMarketResearch,
  addMetrics,
  getAnalysis,
  getAnalysisById
} from "../controllers/analysic.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Specific sub-resource creation routes
router.post("/:businessId/financial", protect, addFinancial);
router.post("/:businessId/swot", protect, addSWOT);
router.post("/:businessId/market", protect, addMarketResearch);
router.post("/:businessId/metrics", protect, addMetrics);

// Score endpoint
router.get("/:businessId/score", protect, getAnalysis);

// Fetch analysis by ID (used by frontend /analysis/[id] page)
router.get("/:id", getAnalysisById);

export default router;