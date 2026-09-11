import express from "express";
import { analyzeIdea, analyzeExistingBusiness } from "../controllers/aiControlers.js";

const router = express.Router();

// Primary AI analysis routes (supporting both naming conventions)
router.post("/analyze", analyzeIdea);
router.post("/analyze-idea", analyzeIdea);

// Existing business analysis route
router.post("/analyze-existing", analyzeExistingBusiness);

export default router;