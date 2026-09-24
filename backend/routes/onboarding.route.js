import express from "express";
import {
  startOnboarding,
  saveOperatingModel,
  saveSalesChannels,
  saveLocations,
  savePosSystem,
  saveFinancialHistory,
  saveCompliance,
  confirmOnboarding,
  getOnboardingSummary,
} from "../controllers/onboarding.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Step 1 — Create business
router.post("/start", protect, startOnboarding);

// Step 2 — Operating model
router.patch("/:businessId/operating-model", protect, saveOperatingModel);

// Step 3 — Sales channels
router.post("/:businessId/channels", protect, saveSalesChannels);

// Step 4 — Store locations (offline/hybrid)
router.post("/:businessId/locations", protect, saveLocations);

// Step 5 — POS / billing
router.post("/:businessId/pos", protect, savePosSystem);

// Step 6 — Financial history (manual)
router.post("/:businessId/financial-history", protect, saveFinancialHistory);

// Step 7 — Compliance
router.post("/:businessId/compliance", protect, saveCompliance);

// Step 8 — Confirm & complete
router.post("/:businessId/confirm", protect, confirmOnboarding);

// GET summary for review screen
router.get("/:businessId/summary", protect, getOnboardingSummary);

export default router;
