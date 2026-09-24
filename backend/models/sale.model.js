import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Sale extends Model {}
Sale.init({
  id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:    { type: DataTypes.INTEGER, allowNull: false },
  orderId:       { type: DataTypes.TEXT, allowNull: true },
  orderDate:     { type: DataTypes.DATE, allowNull: true },
  customerId:    { type: DataTypes.INTEGER, allowNull: true },
  productId:     { type: DataTypes.INTEGER, allowNull: true },
  locationId:    { type: DataTypes.INTEGER, allowNull: true },
  quantity:      { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
  unitPrice:     { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  discount:      { type: DataTypes.DECIMAL(14, 2), allowNull: true, defaultValue: 0 },
  tax:           { type: DataTypes.DECIMAL(14, 2), allowNull: true, defaultValue: 0 },
  totalAmount:   { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  costAmount:    { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  profitAmount:  { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  salesChannel:  { type: DataTypes.TEXT, allowNull: true },
  paymentMethod: { type: DataTypes.TEXT, allowNull: true },
  status:        { type: DataTypes.TEXT, allowNull: true, defaultValue: "completed" },
}, { sequelize, modelName: "Sale", tableName: "sales", timestamps: false, createdAt: "createdAt", updatedAt: false });

export default Sale;
