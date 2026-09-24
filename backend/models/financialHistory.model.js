import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class FinancialHistory extends Model {}
FinancialHistory.init({
  id:                 { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:         { type: DataTypes.INTEGER, allowNull: false },
  periodStart:        { type: DataTypes.DATEONLY, allowNull: false },
  periodEnd:          { type: DataTypes.DATEONLY, allowNull: false },
  periodType:         { type: DataTypes.TEXT, allowNull: true, defaultValue: "month" },  // month | year | quarter
  revenue:            { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  cogs:               { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  grossProfit:        { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  operatingExpenses:  { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  marketingSpend:     { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  netProfit:          { type: DataTypes.DECIMAL(14, 2), allowNull: true },
}, { sequelize, modelName: "FinancialHistory", tableName: "financial_history", timestamps: true });

export default FinancialHistory;
