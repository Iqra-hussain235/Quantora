import { Sequelize } from "sequelize";

// ── Sequelize instance (PostgreSQL) ──────────────────────────────────────────
const sequelize = new Sequelize(
  process.env.DB_NAME || "quantora",
  process.env.DB_USER || "quantora",
  process.env.DB_PASSWORD || "quantoraiqra",
  {
    host: process.env.DB_HOST || "4.224.19.83",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    dialect: "postgres",
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      // SSL only needed for remote hosts; disabled for localhost
      ...(process.env.DB_HOST !== "localhost" && process.env.DB_HOST !== "127.0.0.1"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {}),
    },
  }
);

// ── connectDB — authenticate + sync all models ───────────────────────────────
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("[Quantora] ✅ PostgreSQL connected successfully.");

    // Import associations so FK constraints are registered before sync
    await import("./associations.js");

    // alter:true → create missing tables / columns; never drops data
    await sequelize.sync({ alter: true });
    console.log("[Quantora] ✅ All tables synced with PostgreSQL.");
  } catch (error) {
    console.error("[Quantora] ❌ PostgreSQL connection failed:", error.message);
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;