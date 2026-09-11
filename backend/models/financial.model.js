import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Financial extends Model {}

Financial.init(
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
    initialInvestment: {
      type:      DataTypes.FLOAT,
      allowNull: true,
    },
    monthlyExpenses: {
      type:      DataTypes.FLOAT,
      allowNull: true,
    },
    expectedRevenue: {
      type:      DataTypes.FLOAT,
      allowNull: true,
    },
    breakEvenPoint: {
      type:      DataTypes.FLOAT,
      allowNull: true,
    },
    fundingRequired: {
      type:      DataTypes.FLOAT,
      allowNull: true,
    },
    revenueModel: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Financial",
    tableName: "financials",
    timestamps: true,
  }
);

export default Financial;
