import express from "express";
import { updateUserProfile } from "../controllers/user.controller.js";
import { getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ── All routes below require a valid Bearer JWT ───────────────────────────────

// GET  /api/users/me      → returns current authenticated user (no password)
router.get("/me", protect, getMe);

// PUT  /api/users/profile → update name / email / password
router.put("/profile", protect, updateUserProfile);

export default router;