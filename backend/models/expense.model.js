import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

// ── Expense ───────────────────────────────────────────────────
class Expense extends Model {}
Expense.init({
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:  { type: DataTypes.INTEGER, allowNull: false },
  locationId:  { type: DataTypes.INTEGER, allowNull: true },
  expenseDate: { type: DataTypes.DATEONLY, allowNull: false },
  category:    { type: DataTypes.TEXT, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  amount:      { type: DataTypes.DECIMAL(14, 2), allowNull: false },
}, { sequelize, modelName: "Expense", tableName: "expenses", timestamps: true });

// ── Supplier ──────────────────────────────────────────────────
class Purchase extends Model {}
Purchase.init({
  id:             { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:     { type: DataTypes.INTEGER, allowNull: false },
  supplierId:     { type: DataTypes.INTEGER, allowNull: true },
  purchaseDate:   { type: DataTypes.DATEONLY, allowNull: true },
  invoiceNumber:  { type: DataTypes.TEXT, allowNull: true },
  totalAmount:    { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  status:         { type: DataTypes.TEXT, allowNull: true, defaultValue: "received" },
}, { sequelize, modelName: "Purchase", tableName: "purchases", timestamps: true });

// ── PurchaseItem ──────────────────────────────────────────────
class PurchaseItem extends Model {}
PurchaseItem.init({
  id:         { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  purchaseId: { type: DataTypes.INTEGER, allowNull: false },
  productId:  { type: DataTypes.INTEGER, allowNull: true },
  quantity:   { type: DataTypes.INTEGER, allowNull: false },
  unitCost:   { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  tax:        { type: DataTypes.DECIMAL(14, 2), allowNull: true, defaultValue: 0 },
  totalCost:  { type: DataTypes.DECIMAL(14, 2), allowNull: true },
}, { sequelize, modelName: "PurchaseItem", tableName: "purchase_items", timestamps: false });

export { Expense, Purchase, PurchaseItem };
