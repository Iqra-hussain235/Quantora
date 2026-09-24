import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class BusinessPosSystem extends Model {}
BusinessPosSystem.init({
  id:                 { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:         { type: DataTypes.INTEGER, allowNull: false },
  provider:           { type: DataTypes.TEXT, allowNull: true },
  billingSoftware:    { type: DataTypes.TEXT, allowNull: true },
  terminalCount:      { type: DataTypes.INTEGER, allowNull: true },
  canExportSales:     { type: DataTypes.BOOLEAN, defaultValue: false },
  canExportInventory: { type: DataTypes.BOOLEAN, defaultValue: false },
  integrationStatus:  { type: DataTypes.TEXT, allowNull: true, defaultValue: "manual" },
}, { sequelize, modelName: "BusinessPosSystem", tableName: "business_pos_systems", timestamps: true });

export default BusinessPosSystem;
