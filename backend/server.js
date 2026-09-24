import "./config/env.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.router.js";
import authRoutes from "./routes/auth.route.js";
import businessRoutes from "./routes/business.route.js";
import analysisRoutes from "./routes/report.route.js";
import aiRoutes from "./routes/aiRouters.js";
import existingBusinessRoutes from "./routes/existingBusiness.route.js";
import onboardingRoutes from "./routes/onboarding.route.js";

const startServer = async () => {
  // ── 1. Connect PostgreSQL + sync all Sequelize models ──────────────────────
  await connectDB();

  const app = express();

  // ── 2. Global middleware ────────────────────────────────────────────────────
  app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // ── 3. Request logger (dev only) ────────────────────────────────────────────
  if (process.env.NODE_ENV === "development") {
    app.use((req, _res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });
  }

  if (!process.env.GROQ_API_KEY) {
    console.warn("[Quantora] WARNING: GROQ_API_KEY is not set in .env.");
  }

  // ── 4. API Routes ───────────────────────────────────────────────────────────
  //
  //  AUTH (public + protected)
  //    POST   /api/auth/register        → create account, returns JWT tokens
  //    POST   /api/auth/login           → verify creds, returns JWT tokens
  //    POST   /api/auth/refresh-token   → rotate tokens
  //    POST   /api/auth/logout          → stateless logout (client clears tokens)
  //    GET    /api/auth/me              → returns current user  [protected]
  //
  //  USERS (all protected)
  //    GET    /api/users/me             → alias for /auth/me    [protected]
  //    PUT    /api/users/profile        → update profile        [protected]
  //
  //  BUSINESS (protected)
  //    POST   /api/business             → create business       [protected]
  //    GET    /api/business             → list user businesses  [protected]
  //
  //  ANALYSIS (mix)
  //    POST   /api/analysis/:id/financial  → add financials     [protected]
  //    POST   /api/analysis/:id/swot       → add SWOT           [protected]
  //    POST   /api/analysis/:id/market     → add market data    [protected]
  //    POST   /api/analysis/:id/metrics    → add metrics        [protected]
  //    GET    /api/analysis/:id/score      → get score          [protected]
  //    GET    /api/analysis/:id            → full analysis      [public]
  //
  //  EXISTING BUSINESS (protected)
  //    POST   /api/existing-business       → upload biz data    [protected]
  //
  //  AI (protected)
  //    POST   /api/ai/analyze              → AI analysis        [protected]

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/business", businessRoutes);   // legacy
  app.use("/api/businesses", businessRoutes); // frontend uses this path
  app.use("/api/onboarding", onboardingRoutes); // wizard step-by-step endpoints
  app.use("/api/analysis", analysisRoutes);
  app.use("/api/existing-business", existingBusinessRoutes);
  app.use("/api/ai", aiRoutes);

  // ── 5. Health check (public) ────────────────────────────────────────────────
  app.get("/", (_req, res) =>
    res.json({ success: true, service: "Quantora API", db: "PostgreSQL" })
  );
  app.get("/health", (_req, res) =>
    res.json({ success: true, status: "healthy", timestamp: new Date().toISOString() })
  );

  // ── 6. 404 handler ─────────────────────────────────────────────────────────
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.path} not found.`,
    });
  });

  // ── 7. Centralized error handler ────────────────────────────────────────────
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error("[Server Error]:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal server error.";
    res.status(status).json({ success: false, message });
  });

  // ── 8. Start listening ──────────────────────────────────────────────────────
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n[Quantora] 🚀 Server running on http://localhost:${PORT}`);
    console.log(`[Quantora] 🗄  Database  : PostgreSQL @ ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    console.log(`[Quantora] 🔑 JWT Secret: ${process.env.JWT_SECRET ? "Loaded ✓" : "MISSING ✗"}`);
    console.log(`[Quantora] 🤖 Groq Key  : ${process.env.GROQ_API_KEY ? "Loaded ✓" : "Missing"}`);
    console.log(`[Quantora] 🌍 CORS Origin: ${process.env.CORS_ORIGIN || "http://localhost:3000"}\n`);
  });
};

startServer().catch((err) => {
  console.error("[Quantora] ❌ Failed to start server:", err.message);
  process.exit(1);
});