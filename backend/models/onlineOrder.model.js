import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class OnlineOrder extends Model {}
OnlineOrder.init({
  id:               { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:       { type: DataTypes.INTEGER, allowNull: false },
  externalOrderId:  { type: DataTypes.TEXT, allowNull: true },
  platform:         { type: DataTypes.TEXT, allowNull: true },  // Amazon | Flipkart | Own Website | ...
  orderDate:        { type: DataTypes.DATE, allowNull: true },
  customerId:       { type: DataTypes.INTEGER, allowNull: true },
  totalAmount:      { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  paymentStatus:    { type: DataTypes.TEXT, allowNull: true },
  deliveryStatus:   { type: DataTypes.TEXT, allowNull: true },
  orderStatus:      { type: DataTypes.TEXT, allowNull: true, defaultValue: "placed" },
  shippingCost:     { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  rtoStatus:        { type: DataTypes.TEXT, allowNull: true },
}, { sequelize, modelName: "OnlineOrder", tableName: "online_orders", timestamps: true });

// ── BusinessCompliance ────────────────────────────────────────
class BusinessCompliance extends Model {}
BusinessCompliance.init({
  id:                         { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:                 { type: DataTypes.INTEGER, allowNull: false, unique: true },
  gstRegistered:              { type: DataTypes.BOOLEAN, allowNull: true },
  gstin:                      { type: DataTypes.TEXT, allowNull: true },
  gstRates:                   { type: DataTypes.TEXT, allowNull: true },
  fssaiApplicable:            { type: DataTypes.BOOLEAN, allowNull: true },
  fssaiLicense:               { type: DataTypes.TEXT, allowNull: true },
  legalMetrologyApplicable:   { type: DataTypes.BOOLEAN, allowNull: true },
  privacyPolicy:              { type: DataTypes.TEXT, allowNull: true },
  termsPolicy:                { type: DataTypes.TEXT, allowNull: true },
  returnPolicy:               { type: DataTypes.TEXT, allowNull: true },
}, { sequelize, modelName: "BusinessCompliance", tableName: "business_compliance", timestamps: true });

// ── DataSource ────────────────────────────────────────────────
class DataSource extends Model {}
DataSource.init({
  id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:   { type: DataTypes.INTEGER, allowNull: false },
  sourceType:   { type: DataTypes.TEXT, allowNull: true },  // pos | erp | excel | manual | api
  provider:     { type: DataTypes.TEXT, allowNull: true },
  fileName:     { type: DataTypes.TEXT, allowNull: true },
  status:       { type: DataTypes.TEXT, allowNull: true, defaultValue: "active" },
  lastSyncedAt: { type: DataTypes.DATE, allowNull: true },
}, { sequelize, modelName: "DataSource", tableName: "data_sources", timestamps: true });

// ── DataImport ────────────────────────────────────────────────
class DataImport extends Model {}
DataImport.init({
  id:               { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:       { type: DataTypes.INTEGER, allowNull: false },
  dataSourceId:     { type: DataTypes.INTEGER, allowNull: true },
  fileName:         { type: DataTypes.TEXT, allowNull: true },
  fileType:         { type: DataTypes.TEXT, allowNull: true },
  rowCount:         { type: DataTypes.INTEGER, allowNull: true },
  status:           { type: DataTypes.TEXT, allowNull: true, defaultValue: "pending" },
  mapping:          { type: DataTypes.JSONB, allowNull: true },
  validationResult: { type: DataTypes.JSONB, allowNull: true },
  startedAt:        { type: DataTypes.DATE, allowNull: true },
  completedAt:      { type: DataTypes.DATE, allowNull: true },
}, { sequelize, modelName: "DataImport", tableName: "data_imports", timestamps: false, createdAt: "createdAt", updatedAt: false });

export { OnlineOrder, BusinessCompliance, DataSource, DataImport };
