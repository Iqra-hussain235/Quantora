import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

// ── InventoryBatch ────────────────────────────────────────────
class InventoryBatch extends Model {}
InventoryBatch.init({
  id:                { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:        { type: DataTypes.INTEGER, allowNull: false },
  productId:         { type: DataTypes.INTEGER, allowNull: false },
  batchNumber:       { type: DataTypes.TEXT, allowNull: true },
  quantity:          { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  purchasePrice:     { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  expiryDate:        { type: DataTypes.DATEONLY, allowNull: true },
  manufacturingDate: { type: DataTypes.DATEONLY, allowNull: true },
}, { sequelize, modelName: "InventoryBatch", tableName: "inventory_batches", timestamps: true });

// ── InventoryMovement ─────────────────────────────────────────
class InventoryMovement extends Model {}
InventoryMovement.init({
  id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:    { type: DataTypes.INTEGER, allowNull: false },
  productId:     { type: DataTypes.INTEGER, allowNull: false },
  locationId:    { type: DataTypes.INTEGER, allowNull: true },
  movementType:  { type: DataTypes.TEXT, allowNull: true },  // purchase | sale | return | damage | adjustment
  quantity:      { type: DataTypes.INTEGER, allowNull: false },
  referenceId:   { type: DataTypes.TEXT, allowNull: true },
  movementDate:  { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
}, { sequelize, modelName: "InventoryMovement", tableName: "inventory_movements", timestamps: false,
    createdAt: "createdAt", updatedAt: false });

export { InventoryBatch, InventoryMovement };
