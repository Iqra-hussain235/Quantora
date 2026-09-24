import express from "express";
import {
  createBusiness,
  getUserBusinesses,
  getBusinessById,
  getBusinessMetrics,
  uploadBusinessFile,
  updateBusiness,
  patchBusiness,
} from "../controllers/business.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// POST /api/businesses          → create a new business
router.post("/", protect, createBusiness);

// POST /api/businesses/upload   → upload file (must be before /:id to avoid conflict)
router.post("/upload", protect, upload.single("file"), uploadBusinessFile);

// GET  /api/businesses          → list all businesses for logged-in user
router.get("/", protect, getUserBusinesses);

// GET  /api/businesses/:id          → get single business by id
router.get("/:id", protect, getBusinessById);

// GET  /api/businesses/:id/metrics  → get dashboard metrics for a business
router.get("/:id/metrics", protect, getBusinessMetrics);

// PUT  /api/businesses/:id      → full update
router.put("/:id", protect, updateBusiness);

// PATCH /api/businesses/:id     → partial update
router.patch("/:id", protect, patchBusiness);

export default router;