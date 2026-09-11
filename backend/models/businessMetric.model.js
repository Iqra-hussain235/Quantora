import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class BusinessMetric extends Model {}

BusinessMetric.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },
    // FK to businesses table
    businessId: {
      type:      DataTypes.INTEGER,
      allowNull: false,
    },
    competitorName: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    cac: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    ltv: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    churnRate: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    revenueGrowthRate: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "BusinessMetric",
    tableName: "business_metrics",
    timestamps: true,
  }
);

export default BusinessMetric;
