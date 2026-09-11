const JWT_SECRET = process.env.JWT_SECRET || "dev_default_jwt_secret_change_this";

if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET is not set in environment variables. Using insecure default secret for development only.");
}

export default JWT_SECRET;

// import crypto from "crypto";

// const JWT_SECRET = crypto.randomBytes(64).toString("hex");

// export default JWT_SECRET;