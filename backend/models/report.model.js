import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Report extends Model {}

Report.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },
    // FK to users table — nullable (required: false in original)
    userId: {
      type:      DataTypes.INTEGER,
      allowNull: true,
    },
    // FK to businesses table — nullable (required: false in original)
    businessId: {
      type:      DataTypes.INTEGER,
      allowNull: true,
    },
    ideaText: {
      type:      DataTypes.TEXT,
      allowNull: false,
    },
    // Nested score object stored as JSON text
    score: {
      type:      DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("score");
        try { return raw ? JSON.parse(raw) : null; } catch { return null; }
      },
      set(val) {
        this.setDataValue("score", val ? JSON.stringify(val) : null);
      },
    },
    // Mixed/free-form fields stored as JSON text
    insights: {
      type:      DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("insights");
        try { return raw ? JSON.parse(raw) : null; } catch { return null; }
      },
      set(val) {
        this.setDataValue("insights", val ? JSON.stringify(val) : null);
      },
    },
    market: {
      type:      DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("market");
        try { return raw ? JSON.parse(raw) : null; } catch { return null; }
      },
      set(val) {
        this.setDataValue("market", val ? JSON.stringify(val) : null);
      },
    },
    competitors: {
      type:      DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("competitors");
        try { return raw ? JSON.parse(raw) : null; } catch { return null; }
      },
      set(val) {
        this.setDataValue("competitors", val ? JSON.stringify(val) : null);
      },
    },
    growth: {
      type:      DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("growth");
        try { return raw ? JSON.parse(raw) : null; } catch { return null; }
      },
      set(val) {
        this.setDataValue("growth", val ? JSON.stringify(val) : null);
      },
    },
    risk: {
      type:      DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("risk");
        try { return raw ? JSON.parse(raw) : null; } catch { return null; }
      },
      set(val) {
        this.setDataValue("risk", val ? JSON.stringify(val) : null);
      },
    },
    vc_readiness: {
      type:      DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("vc_readiness");
        try { return raw ? JSON.parse(raw) : null; } catch { return null; }
      },
      set(val) {
        this.setDataValue("vc_readiness", val ? JSON.stringify(val) : null);
      },
    },
  },
  {
    sequelize,
    modelName: "Report",
    tableName: "reports",
    timestamps: true,
  }
);

export default Report;
