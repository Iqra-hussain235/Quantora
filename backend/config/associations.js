/**
 * config/associations.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Defines all Sequelize model associations (FK relationships).
 * Imported once inside connectDB() BEFORE sync() runs, so every table
 * is registered with Sequelize and gets created/altered on startup.
 *
 * IMPORTANT: Every model file must be imported here — even models with no
 * explicit association — so Sequelize includes them in sequelize.sync().
 */

// ── Core / existing models ────────────────────────────────────
import User             from "../models/user.model.js";
import Business         from "../models/business.model.js";
import BusinessMetric   from "../models/businessMetric.model.js";
import Competitor       from "../models/competitor.model.js";
import ExistingBusiness from "../models/existingbusiness.model.js";
import Financial        from "../models/financial.model.js";
import MarketResearch   from "../models/marketResearch.model.js";
import Profile          from "../models/profile.model.js";
import Report           from "../models/report.model.js";
import SWOT             from "../models/swot.model.js";

// ── New normalized models ─────────────────────────────────────
import BusinessLocation       from "../models/businessLocation.model.js";
import BusinessSalesChannel   from "../models/businessSalesChannel.model.js";
import BusinessPosSystem      from "../models/businessPosSystem.model.js";
import Supplier               from "../models/supplier.model.js";
import Product                from "../models/product.model.js";
import { InventoryBatch, InventoryMovement } from "../models/inventory.model.js";
import Customer               from "../models/customer.model.js";
import Sale                   from "../models/sale.model.js";
import FinancialHistory       from "../models/financialHistory.model.js";
import { Expense, Purchase, PurchaseItem }   from "../models/expense.model.js";
import { OnlineOrder, BusinessCompliance, DataSource, DataImport } from "../models/onlineOrder.model.js";

// ════════════════════════════════════════════════════════════
// EXISTING ASSOCIATIONS (unchanged)
// ════════════════════════════════════════════════════════════

// User ↔ Business
User.hasMany(Business,             { foreignKey: "userId", as: "businesses",          onDelete: "CASCADE" });
Business.belongsTo(User,           { foreignKey: "userId", as: "user" });

// User ↔ ExistingBusiness
User.hasMany(ExistingBusiness,     { foreignKey: "userId", as: "existingBusinesses",  onDelete: "CASCADE" });
ExistingBusiness.belongsTo(User,   { foreignKey: "userId", as: "user" });

// User ↔ Profile (1:1)
User.hasOne(Profile,               { foreignKey: "userId", as: "profile",             onDelete: "CASCADE" });
Profile.belongsTo(User,            { foreignKey: "userId", as: "user" });

// User ↔ Report
User.hasMany(Report,               { foreignKey: "userId", as: "reports",             onDelete: "SET NULL" });
Report.belongsTo(User,             { foreignKey: "userId", as: "user" });

// Business ↔ Financial
Business.hasMany(Financial,        { foreignKey: "businessId", as: "financials",      onDelete: "CASCADE" });
Financial.belongsTo(Business,      { foreignKey: "businessId", as: "business" });

// Business ↔ SWOT
Business.hasMany(SWOT,             { foreignKey: "businessId", as: "swots",           onDelete: "CASCADE" });
SWOT.belongsTo(Business,           { foreignKey: "businessId", as: "business" });

// Business ↔ MarketResearch
Business.hasMany(MarketResearch,   { foreignKey: "businessId", as: "marketResearches",onDelete: "CASCADE" });
MarketResearch.belongsTo(Business, { foreignKey: "businessId", as: "business" });

// Business ↔ BusinessMetric
Business.hasMany(BusinessMetric,   { foreignKey: "businessId", as: "metrics",         onDelete: "CASCADE" });
BusinessMetric.belongsTo(Business, { foreignKey: "businessId", as: "business" });

// Business ↔ Competitor
Business.hasMany(Competitor,       { foreignKey: "businessId", as: "competitors",     onDelete: "SET NULL" });
Competitor.belongsTo(Business,     { foreignKey: "businessId", as: "business" });

// Business ↔ Report
Business.hasMany(Report,           { foreignKey: "businessId", as: "reports",         onDelete: "SET NULL" });
Report.belongsTo(Business,         { foreignKey: "businessId", as: "business" });

// ════════════════════════════════════════════════════════════
// NEW NORMALIZED MODEL ASSOCIATIONS
// ════════════════════════════════════════════════════════════

// Business ↔ Locations
Business.hasMany(BusinessLocation,       { foreignKey: "businessId", as: "locations",         onDelete: "CASCADE" });
BusinessLocation.belongsTo(Business,     { foreignKey: "businessId", as: "business" });

// Business ↔ Sales Channels
Business.hasMany(BusinessSalesChannel,   { foreignKey: "businessId", as: "salesChannels",     onDelete: "CASCADE" });
BusinessSalesChannel.belongsTo(Business, { foreignKey: "businessId", as: "business" });

// Business ↔ POS Systems
Business.hasMany(BusinessPosSystem,      { foreignKey: "businessId", as: "posSystems",        onDelete: "CASCADE" });
BusinessPosSystem.belongsTo(Business,    { foreignKey: "businessId", as: "business" });

// Business ↔ Compliance (1:1)
Business.hasOne(BusinessCompliance,      { foreignKey: "businessId", as: "compliance",        onDelete: "CASCADE" });
BusinessCompliance.belongsTo(Business,   { foreignKey: "businessId", as: "business" });

// Business ↔ Financial History
Business.hasMany(FinancialHistory,       { foreignKey: "businessId", as: "financialHistory",  onDelete: "CASCADE" });
FinancialHistory.belongsTo(Business,     { foreignKey: "businessId", as: "business" });

// Business ↔ Suppliers
Business.hasMany(Supplier,              { foreignKey: "businessId", as: "suppliers",          onDelete: "CASCADE" });
Supplier.belongsTo(Business,            { foreignKey: "businessId", as: "business" });

// Business ↔ Products
Business.hasMany(Product,               { foreignKey: "businessId", as: "products",           onDelete: "CASCADE" });
Product.belongsTo(Business,             { foreignKey: "businessId", as: "business" });

// Supplier ↔ Products
Supplier.hasMany(Product,               { foreignKey: "supplierId", as: "products" });
Product.belongsTo(Supplier,             { foreignKey: "supplierId", as: "supplier" });

// Business ↔ InventoryBatches
Business.hasMany(InventoryBatch,        { foreignKey: "businessId", as: "inventoryBatches",   onDelete: "CASCADE" });
InventoryBatch.belongsTo(Business,      { foreignKey: "businessId", as: "business" });
Product.hasMany(InventoryBatch,         { foreignKey: "productId",  as: "batches",            onDelete: "CASCADE" });
InventoryBatch.belongsTo(Product,       { foreignKey: "productId",  as: "product" });

// Business ↔ InventoryMovements
Business.hasMany(InventoryMovement,     { foreignKey: "businessId", as: "inventoryMovements", onDelete: "CASCADE" });
InventoryMovement.belongsTo(Business,   { foreignKey: "businessId", as: "business" });
Product.hasMany(InventoryMovement,      { foreignKey: "productId",  as: "movements",          onDelete: "CASCADE" });
InventoryMovement.belongsTo(Product,    { foreignKey: "productId",  as: "product" });

// Business ↔ Customers
Business.hasMany(Customer,              { foreignKey: "businessId", as: "customers",           onDelete: "CASCADE" });
Customer.belongsTo(Business,            { foreignKey: "businessId", as: "business" });

// Business ↔ Sales
Business.hasMany(Sale,                  { foreignKey: "businessId", as: "sales",              onDelete: "CASCADE" });
Sale.belongsTo(Business,               { foreignKey: "businessId", as: "business" });
Customer.hasMany(Sale,                  { foreignKey: "customerId", as: "sales" });
Sale.belongsTo(Customer,               { foreignKey: "customerId", as: "customer" });
Product.hasMany(Sale,                   { foreignKey: "productId",  as: "sales" });
Sale.belongsTo(Product,                { foreignKey: "productId",  as: "product" });

// Business ↔ Expenses
Business.hasMany(Expense,               { foreignKey: "businessId", as: "expenses",           onDelete: "CASCADE" });
Expense.belongsTo(Business,             { foreignKey: "businessId", as: "business" });

// Business ↔ Online Orders
Business.hasMany(OnlineOrder,           { foreignKey: "businessId", as: "onlineOrders",       onDelete: "CASCADE" });
OnlineOrder.belongsTo(Business,         { foreignKey: "businessId", as: "business" });
Customer.hasMany(OnlineOrder,           { foreignKey: "customerId", as: "onlineOrders" });
OnlineOrder.belongsTo(Customer,         { foreignKey: "customerId", as: "customer" });

// Business ↔ Purchases
Business.hasMany(Purchase,              { foreignKey: "businessId", as: "purchases",          onDelete: "CASCADE" });
Purchase.belongsTo(Business,            { foreignKey: "businessId", as: "business" });
Supplier.hasMany(Purchase,              { foreignKey: "supplierId", as: "purchases" });
Purchase.belongsTo(Supplier,            { foreignKey: "supplierId", as: "supplier" });

// Purchase ↔ PurchaseItems
Purchase.hasMany(PurchaseItem,          { foreignKey: "purchaseId", as: "items",              onDelete: "CASCADE" });
PurchaseItem.belongsTo(Purchase,        { foreignKey: "purchaseId", as: "purchase" });
Product.hasMany(PurchaseItem,           { foreignKey: "productId",  as: "purchaseItems" });
PurchaseItem.belongsTo(Product,         { foreignKey: "productId",  as: "product" });

// Business ↔ DataSources
Business.hasMany(DataSource,            { foreignKey: "businessId", as: "dataSources",        onDelete: "CASCADE" });
DataSource.belongsTo(Business,          { foreignKey: "businessId", as: "business" });

// Business ↔ DataImports
Business.hasMany(DataImport,            { foreignKey: "businessId", as: "dataImports",        onDelete: "CASCADE" });
DataImport.belongsTo(Business,          { foreignKey: "businessId", as: "business" });
DataSource.hasMany(DataImport,          { foreignKey: "dataSourceId", as: "imports" });
DataImport.belongsTo(DataSource,        { foreignKey: "dataSourceId", as: "dataSource" });

// ════════════════════════════════════════════════════════════
export {
  // existing
  User, Business, BusinessMetric, Competitor,
  ExistingBusiness, Financial, MarketResearch,
  Profile, Report, SWOT,
  // new
  BusinessLocation, BusinessSalesChannel, BusinessPosSystem,
  Supplier, Product, InventoryBatch, InventoryMovement,
  Customer, Sale, FinancialHistory,
  Expense, Purchase, PurchaseItem,
  OnlineOrder, BusinessCompliance, DataSource, DataImport,
};
