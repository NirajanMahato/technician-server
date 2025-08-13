const rateLimit = require("express-rate-limit");

const rateLimiterConfig = () => {
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
      error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const burstLimiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 10,
    message: {
      error: "Too many requests in a short time, slow down.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  return {
    generalLimiter,
    burstLimiter,
  };
};

module.exports = { rateLimiterConfig };