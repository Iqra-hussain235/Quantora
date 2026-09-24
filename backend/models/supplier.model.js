import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Supplier extends Model {}
Supplier.init({
  id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:   { type: DataTypes.INTEGER, allowNull: false },
  name:         { type: DataTypes.TEXT, allowNull: false },
  contact:      { type: DataTypes.TEXT, allowNull: true },
  email:        { type: DataTypes.TEXT, allowNull: true },
  phone:        { type: DataTypes.TEXT, allowNull: true },
  paymentTerms: { type: DataTypes.TEXT, allowNull: true },
}, { sequelize, modelName: "Supplier", tableName: "suppliers", timestamps: true });

export default Supplier;
