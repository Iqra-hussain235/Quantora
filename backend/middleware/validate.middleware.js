/**
 * middleware/validate.middleware.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight request-body validation for auth endpoints.
 * Returns 400 with a structured error before the controller even runs.
 */

// ── Email format check ────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── validateRegister ──────────────────────────────────────────────────────────
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body || {};
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters.");
  }
  if (!email || !EMAIL_RE.test(email)) {
    errors.push("A valid email address is required.");
  }
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  if (errors.length) {
    return res.status(400).json({ success: false, message: errors.join(" ") });
  }
  next();
};

// ── validateLogin ─────────────────────────────────────────────────────────────
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email || !EMAIL_RE.test(email)) {
    errors.push("A valid email address is required.");
  }
  if (!password) {
    errors.push("Password is required.");
  }

  if (errors.length) {
    return res.status(400).json({ success: false, message: errors.join(" ") });
  }
  next();
};
