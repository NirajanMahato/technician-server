const cors = require("cors");
const helmet = require("helmet");

function corsConfig() {
  return {
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.REACT_NATIVE_URL,
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8081",
        "http://localhost:19006",
      ];

      if (!origin || allowedOrigins.includes(origin) || origin.includes("localhost")) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-requested-with",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    exposedHeaders: ["x-total-count"],
    maxAge: 86400,
    optionsSuccessStatus: 200,
  };
}

function setupSecurityHeaders() {
  const helmetConfig = helmet({
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: "strict-origin-when-cross-origin",
    xssFilter: true,
  });

  const customHeaders = (req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
    res.setHeader("X-Download-Options", "noopen");
    res.setHeader("X-DNS-Prefetch-Control", "off");

    if (req.method === "GET") {
      res.setHeader("Cache-Control", "public, max-age=300");
      res.removeHeader("Pragma");
      res.removeHeader("Expires");
      res.removeHeader("Surrogate-Control");
    } else {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Surrogate-Control", "no-store");
    }

    const cspDirectives =
      process.env.NODE_ENV === "production"
        ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; object-src 'none'; upgrade-insecure-requests; block-all-mixed-content"
        : "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; object-src 'none';";

    res.setHeader("Content-Security-Policy", cspDirectives);

    next();
  };

  return {
    helmetConfig,
    customHeaders,
    corsConfig: cors(corsConfig()),
  };
}

module.exports = { setupSecurityHeaders };