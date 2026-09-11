import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateRegister, validateLogin } from "../middleware/validate.middleware.js";

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────
// POST /api/auth/register   → validate body → create user → return JWT tokens
router.post("/register", validateRegister, register);

// POST /api/auth/login      → validate body → verify credentials → return JWT tokens
router.post("/login", validateLogin, login);

// POST /api/auth/refresh-token → rotate access + refresh tokens
router.post("/refresh-token", refreshToken);

// POST /api/auth/logout
router.post("/logout", logout);

// ── Protected routes (Bearer token required) ──────────────────────────────────
// GET /api/auth/me          → returns authenticated user (no password)
router.get("/me", protect, getMe);

export default router;
