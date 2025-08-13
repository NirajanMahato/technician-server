require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const compression = require("compression");
const apiConfig = require("./config/api_config");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

connectDB();

const { helmetConfig, customHeaders, corsConfig } = apiConfig.security.headers;
const { generalLimiter, burstLimiter } = apiConfig.security.rateLimit;

app.use(helmetConfig);
app.use(customHeaders);

app.use(corsConfig);

app.use(generalLimiter);
app.use(burstLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(compression());

app.use(morgan(apiConfig.logging.format));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Technician Booking API is running",
    timestamp: new Date().toISOString(),
    environment: apiConfig.env.NODE_ENV,
  });
});

//routes
app.use("/api/v1/users", userRoutes);

app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS Error",
      message: "Origin not allowed",
    });
  }

  if (err.status === 429) {
    return res.status(429).json({
      error: "Rate Limit Exceeded",
      message: err.message,
      retryAfter: err.headers?.["retry-after"],
    });
  }

  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message:
      apiConfig.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
    ...(apiConfig.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
