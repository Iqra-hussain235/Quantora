import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load .env from current directory or parent directory
const localEnv = path.resolve(process.cwd(), ".env");
const parentEnv = path.resolve(process.cwd(), "../.env");

if (fs.existsSync(localEnv)) {
  dotenv.config({ path: localEnv });
} else if (fs.existsSync(parentEnv)) {
  dotenv.config({ path: parentEnv });
}
