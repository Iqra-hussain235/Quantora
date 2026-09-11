import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class Profile extends Model {}

Profile.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },
    // FK to users table — one profile per user
    userId: {
      type:      DataTypes.INTEGER,
      allowNull: false,
      unique:    true,
    },
    bio: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    company: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    website: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    avatarUrl: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    phoneNumber: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Profile",
    tableName: "profiles",
    timestamps: true,
  }
);

export default Profile;
