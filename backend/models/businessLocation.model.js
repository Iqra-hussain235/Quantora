import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class BusinessLocation extends Model {}

BusinessLocation.init({
  id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  businessId:   { type: DataTypes.INTEGER, allowNull: false },
  name:         { type: DataTypes.TEXT, allowNull: true },
  address:      { type: DataTypes.TEXT, allowNull: true },
  country:      { type: DataTypes.TEXT, allowNull: true },
  state:        { type: DataTypes.TEXT, allowNull: true },
  city:         { type: DataTypes.TEXT, allowNull: true },
  pincode:      { type: DataTypes.TEXT, allowNull: true },
  storeType:    { type: DataTypes.TEXT, allowNull: true },
  openingDate:  { type: DataTypes.DATEONLY, allowNull: true },
  status:       { type: DataTypes.TEXT, allowNull: true, defaultValue: "active" },
}, {
  sequelize,
  modelName: "BusinessLocation",
  tableName: "business_locations",
  timestamps: true,
});

export default BusinessLocation;
