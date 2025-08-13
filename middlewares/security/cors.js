const corsConfig = () => ({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.REACT_NATIVE_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:8081",
      "http://localhost:19006",
    ];

    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.includes("localhost")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
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
});

module.exports = corsConfig;
