import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import JWT_SECRET from "../config/jwt.secret.js";

// ── protect ───────────────────────────────────────────────────────────────────
// Verifies the Bearer JWT and attaches req.user (without password).
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized — no token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired — please refresh" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    // Sequelize: findByPk instead of findById, attributes instead of .select("-password")
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("[AUTH MIDDLEWARE]:", error.message);
    res.status(500).json({ message: "Server error during authentication" });
  }
};

// ── authorize ─────────────────────────────────────────────────────────────────
// Role-based access guard. Must be used AFTER protect.
// Usage: router.delete("/admin-route", protect, authorize("admin"), handler)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        message: `Access denied — requires role: ${roles.join(" or ")}`,
      });
    }
    next();
  };
};