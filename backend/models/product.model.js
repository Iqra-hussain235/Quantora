import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Product extends Model {}
Product.init({
  id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:    { type: DataTypes.INTEGER, allowNull: false },
  supplierId:    { type: DataTypes.INTEGER, allowNull: true },
  sku:           { type: DataTypes.TEXT, allowNull: true },
  barcode:       { type: DataTypes.TEXT, allowNull: true },
  name:          { type: DataTypes.TEXT, allowNull: false },
  category:      { type: DataTypes.TEXT, allowNull: true },
  brand:         { type: DataTypes.TEXT, allowNull: true },
  unit:          { type: DataTypes.TEXT, allowNull: true },
  purchasePrice: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  sellingPrice:  { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  mrp:           { type: DataTypes.DECIMAL(14, 2), allowNull: true },
  gstRate:       { type: DataTypes.DECIMAL(6, 2), allowNull: true },
  currentStock:  { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  reorderLevel:  { type: DataTypes.INTEGER, allowNull: true },
}, { sequelize, modelName: "Product", tableName: "products", timestamps: true });

export default Product;
