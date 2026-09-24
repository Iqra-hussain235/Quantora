import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Customer extends Model {}
Customer.init({
  id:                 { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:         { type: DataTypes.INTEGER, allowNull: false },
  externalCustomerId: { type: DataTypes.TEXT, allowNull: true },
  name:               { type: DataTypes.TEXT, allowNull: true },
  email:              { type: DataTypes.TEXT, allowNull: true },
  phone:              { type: DataTypes.TEXT, allowNull: true },
  city:               { type: DataTypes.TEXT, allowNull: true },
  state:              { type: DataTypes.TEXT, allowNull: true },
  country:            { type: DataTypes.TEXT, allowNull: true },
  signupDate:         { type: DataTypes.DATEONLY, allowNull: true },
  lastOrderDate:      { type: DataTypes.DATEONLY, allowNull: true },
  totalOrders:        { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  totalSpend:         { type: DataTypes.DECIMAL(14, 2), allowNull: true, defaultValue: 0 },
}, { sequelize, modelName: "Customer", tableName: "customers", timestamps: true });

export default Customer;
