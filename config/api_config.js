const envConfig = require("./env_config");
const { setupSecurityHeaders } = require("../middlewares/security/headers");
const { rateLimiterConfig } = require("../middlewares/security/rate_limit");
const corsConfig = require("../middlewares/security/cors");

const apiConfig = {
  env: envConfig,

  security: {
    cors: corsConfig(),
    headers: setupSecurityHeaders(),
    rateLimit: rateLimiterConfig(),
  },

  database: {
    uri: envConfig.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },

  jwt: {
    secret: envConfig.JWT_SECRET,
    expiresIn: envConfig.JWT_EXPIRE,
    cookieExpire: envConfig.JWT_COOKIE_EXPIRE,
  },

  upload: {
    maxFileSize: envConfig.MAX_FILE_SIZE,
    uploadPath: envConfig.UPLOAD_PATH,
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "text/plain",
    ],
  },

  email: {
    host: envConfig.EMAIL_HOST,
    port: envConfig.EMAIL_PORT,
    user: envConfig.EMAIL_USER,
    pass: envConfig.EMAIL_PASS,
    secure: envConfig.NODE_ENV === "production",
  },

  logging: {
    level: envConfig.LOG_LEVEL,
    format: envConfig.NODE_ENV === "production" ? "combined" : "dev",
  },

  corsOrigins: [
    envConfig.FRONTEND_URL,
    envConfig.REACT_NATIVE_URL,
    ...(envConfig.NODE_ENV === "development"
      ? [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:8081",
          "http://localhost:19006",
        ]
      : []),
  ],
};

module.exports = apiConfig;