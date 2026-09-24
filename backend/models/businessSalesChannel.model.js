import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class BusinessSalesChannel extends Model {}
BusinessSalesChannel.init({
  id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:   { type: DataTypes.INTEGER, allowNull: false },
  channelType:  { type: DataTypes.TEXT, allowNull: true },   // physical_store | own_website | marketplace | ...
  platformName: { type: DataTypes.TEXT, allowNull: true },   // Amazon | Flipkart | Shopify | ...
  platformUrl:  { type: DataTypes.TEXT, allowNull: true },
  status:       { type: DataTypes.TEXT, allowNull: true, defaultValue: "active" },
}, { sequelize, modelName: "BusinessSalesChannel", tableName: "business_sales_channels", timestamps: true });

export default BusinessSalesChannel;
