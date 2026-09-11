import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class ExistingBusiness extends Model {}

ExistingBusiness.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },
    // FK to users table
    userId: {
      type:      DataTypes.INTEGER,
      allowNull: true,
    },
    businessName: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    website: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    appName: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    branches: {
      type:      DataTypes.INTEGER,
      allowNull: true,
    },
    extractedData: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    // [String] array stored as JSON text
    branchLocations: {
      type:      DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("branchLocations");
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
      },
      set(val) {
        this.setDataValue("branchLocations", JSON.stringify(val || []));
      },
    },
    file: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ExistingBusiness",
    tableName: "existing_businesses",
    timestamps: true,
  }
);

export default ExistingBusiness;