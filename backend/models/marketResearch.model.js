import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class MarketResearch extends Model {}

MarketResearch.init(
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
    targetMarket: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    marketSize: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    customerDemographics: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    primaryCompetitors: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "MarketResearch",
    tableName: "market_researches",
    timestamps: true,
  }
);

export default MarketResearch;
