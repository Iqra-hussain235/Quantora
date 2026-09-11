import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class SWOT extends Model {}

SWOT.init(
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
    strengths: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    weaknesses: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    opportunities: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    threats: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "SWOT",
    tableName: "swots",
    timestamps: true,
  }
);

export default SWOT;
