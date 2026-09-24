import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Business extends Model {}

Business.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },
    userId: {
      type:      DataTypes.INTEGER,
      allowNull: false,
    },
    businessName: {
      type:      DataTypes.TEXT,
      allowNull: false,
    },
    brandName:             { type: DataTypes.TEXT, allowNull: true },
    industry:              { type: DataTypes.TEXT, allowNull: true },
    stage: {
      type: DataTypes.ENUM("Idea", "MVP", "Early Revenue", "Growth", "Scaling", "Startup"),
      allowNull: true,
    },
    description:           { type: DataTypes.TEXT, allowNull: true },
    targetAudience:        { type: DataTypes.TEXT, allowNull: true },
    problemStatement:      { type: DataTypes.TEXT, allowNull: true },
    solution:              { type: DataTypes.TEXT, allowNull: true },
    uniqueValueProposition:{ type: DataTypes.TEXT, allowNull: true },

    // ── Extended business profile ──────────────────────────────
    businessType:   { type: DataTypes.TEXT, allowNull: true },   // E-commerce | Grocery | SaaS | Restaurant …
    businessModel:  { type: DataTypes.TEXT, allowNull: true },   // B2C | B2B | D2C | Marketplace | SaaS …
    operatingModel: { type: DataTypes.TEXT, allowNull: true },   // online_only | offline_only | hybrid
    country:        { type: DataTypes.TEXT, allowNull: true },
    state:          { type: DataTypes.TEXT, allowNull: true },
    city:           { type: DataTypes.TEXT, allowNull: true },
    pincode:        { type: DataTypes.TEXT, allowNull: true },
    currency:       { type: DataTypes.TEXT, allowNull: true, defaultValue: "USD" },
    website:        { type: DataTypes.TEXT, allowNull: true },
    employeeCount:  { type: DataTypes.TEXT, allowNull: true },   // e.g. "1-10", "11-50", "51-200"
    isDemo:         { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    // ── Onboarding progress ────────────────────────────────────
    onboardingStep: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    onboardingDone: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    // ── Uploaded file / parsed data ───────────────────────────
    pdfDetails:    { type: DataTypes.TEXT, allowNull: true },
    uploadedFile:  { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: "Business",
    tableName: "businesses",
    timestamps: true,
  }
);

export default Business;