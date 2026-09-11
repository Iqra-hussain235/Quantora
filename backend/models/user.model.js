import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class User extends Model {}

User.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },
    name: {
      type:      DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type:      DataTypes.TEXT,
      allowNull: false,
      unique:    true,
    },
    password: {
      type:      DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type:         DataTypes.ENUM("user", "admin"),
      allowNull:    false,
      defaultValue: "user",
    },
    isVerified: {
      type:         DataTypes.BOOLEAN,
      allowNull:    false,
      defaultValue: false,
    },
    subscriptionType: {
      type:         DataTypes.ENUM("Free", "Pro", "Enterprise"),
      allowNull:    false,
      defaultValue: "Free",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

export default User;