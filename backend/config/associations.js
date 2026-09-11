/**
 * config/associations.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Defines all Sequelize model associations (FK relationships).
 * Imported once inside connectDB() AFTER models are defined, so every table
 * is registered before sync() runs.
 */

import User            from "../models/user.model.js";
import Business        from "../models/business.model.js";
import BusinessMetric  from "../models/businessMetric.model.js";
import Competitor      from "../models/competitor.model.js";
import ExistingBusiness from "../models/existingbusiness.model.js";
import Financial       from "../models/financial.model.js";
import MarketResearch  from "../models/marketResearch.model.js";
import Profile         from "../models/profile.model.js";
import Report          from "../models/report.model.js";
import SWOT            from "../models/swot.model.js";

// ── User → Business (one user has many businesses) ───────────────────────────
User.hasMany(Business,         { foreignKey: "userId", as: "businesses",        onDelete: "CASCADE" });
Business.belongsTo(User,       { foreignKey: "userId", as: "user" });

// ── User → ExistingBusiness ───────────────────────────────────────────────────
User.hasMany(ExistingBusiness, { foreignKey: "userId", as: "existingBusinesses", onDelete: "CASCADE" });
ExistingBusiness.belongsTo(User, { foreignKey: "userId", as: "user" });

// ── User → Profile (one-to-one) ───────────────────────────────────────────────
User.hasOne(Profile,           { foreignKey: "userId", as: "profile",            onDelete: "CASCADE" });
Profile.belongsTo(User,        { foreignKey: "userId", as: "user" });

// ── User → Report ─────────────────────────────────────────────────────────────
User.hasMany(Report,           { foreignKey: "userId", as: "reports",            onDelete: "SET NULL" });
Report.belongsTo(User,         { foreignKey: "userId", as: "user" });

// ── Business → Financial ──────────────────────────────────────────────────────
Business.hasMany(Financial,    { foreignKey: "businessId", as: "financials",     onDelete: "CASCADE" });
Financial.belongsTo(Business,  { foreignKey: "businessId", as: "business" });

// ── Business → SWOT ───────────────────────────────────────────────────────────
Business.hasMany(SWOT,         { foreignKey: "businessId", as: "swots",          onDelete: "CASCADE" });
SWOT.belongsTo(Business,       { foreignKey: "businessId", as: "business" });

// ── Business → MarketResearch ─────────────────────────────────────────────────
Business.hasMany(MarketResearch, { foreignKey: "businessId", as: "marketResearches", onDelete: "CASCADE" });
MarketResearch.belongsTo(Business, { foreignKey: "businessId", as: "business" });

// ── Business → BusinessMetric ─────────────────────────────────────────────────
Business.hasMany(BusinessMetric, { foreignKey: "businessId", as: "metrics",      onDelete: "CASCADE" });
BusinessMetric.belongsTo(Business, { foreignKey: "businessId", as: "business" });

// ── Business → Competitor ─────────────────────────────────────────────────────
Business.hasMany(Competitor,   { foreignKey: "businessId", as: "competitors",    onDelete: "SET NULL" });
Competitor.belongsTo(Business, { foreignKey: "businessId", as: "business" });

// ── Business → Report ─────────────────────────────────────────────────────────
Business.hasMany(Report,       { foreignKey: "businessId", as: "reports",        onDelete: "SET NULL" });
Report.belongsTo(Business,     { foreignKey: "businessId", as: "business" });

export {
  User, Business, BusinessMetric, Competitor,
  ExistingBusiness, Financial, MarketResearch,
  Profile, Report, SWOT,
};
