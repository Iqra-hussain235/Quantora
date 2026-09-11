import jwt from "jsonwebtoken";
import JWT_SECRET from "../config/jwt.secret.js";

// ── Access token (short-lived) ────────────────────────────────────────────────
export const generateAccessToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || "15m",
  });
};

// ── Refresh token (long-lived) ────────────────────────────────────────────────
export const generateRefreshToken = (id) => {
  const refreshSecret =
    process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_change_this";
  return jwt.sign({ id }, refreshSecret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION || "7d",
  });
};

// ── Default export kept for backward-compatibility (user.controller.js) ───────
const generateToken = (id) => generateAccessToken(id);
export default generateToken;
