import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Competitor extends Model {}

Competitor.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },
    // FK to businesses table — nullable (required: false in original schema)
    businessId: {
      type:      DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type:      DataTypes.TEXT,
      allowNull: false,
    },
    marketShare: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    // [String] arrays stored as JSON text
    strengths: {
      type:      DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("strengths");
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
      },
      set(val) {
        this.setDataValue("strengths", JSON.stringify(val || []));
      },
    },
    weaknesses: {
      type:      DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("weaknesses");
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
      },
      set(val) {
        this.setDataValue("weaknesses", JSON.stringify(val || []));
      },
    },
    pricing: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    differentiation: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Competitor",
    tableName: "competitors",
    timestamps: true,
  }
);

export default Competitor;
