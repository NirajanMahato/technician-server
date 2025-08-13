require("dotenv").config();

const envConfig = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,

  // Database Configuration
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/technician_booking",

  // Frontend URLs (for CORS)
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  REACT_NATIVE_URL: process.env.REACT_NATIVE_URL || "http://localhost:8081",

  // JWT Configuration
  JWT_SECRET:
    process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE || 7,

  // Email Configuration (for notifications)
  EMAIL_HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",

  // File Upload Configuration
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  BURST_LIMIT_WINDOW_MS: process.env.BURST_LIMIT_WINDOW_MS || 1000, // 1 second
  BURST_LIMIT_MAX_REQUESTS: process.env.BURST_LIMIT_MAX_REQUESTS || 10,

  // Security
  SESSION_SECRET:
    process.env.SESSION_SECRET || "your-session-secret-change-in-production",

};

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0 && envConfig.NODE_ENV === "production") {
  console.error("Missing required environment variables:", missingEnvVars);
  process.exit(1);
}

module.exports = envConfig;
