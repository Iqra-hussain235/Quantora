import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Business extends Model {}

Business.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },
    // FK to users table — defined as plain column here; association added in associations.js
    userId: {
      type:      DataTypes.INTEGER,
      allowNull: false,
    },
    businessName: {
      type:      DataTypes.TEXT,
      allowNull: false,
    },
    brandName: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    industry: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    stage: {
      type:      DataTypes.ENUM("Idea", "MVP", "Early Revenue", "Growth", "Scaling", "Startup"),
      allowNull: true,
    },
    description: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    targetAudience: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    problemStatement: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    solution: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    uniqueValueProposition: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Business",
    tableName: "businesses",
    timestamps: true,
  }
);

export default Business;