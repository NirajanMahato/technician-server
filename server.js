const app = require("./app");
const apiConfig = require("./config/api_config");

const PORT = apiConfig.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server URL: http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.error("Unhandled Promise Rejection:", err);
  console.error("Promise:", promise);

  server.close(() => {
    console.log("Server closed due to unhandled promise rejection");
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  console.error("Stack:", err.stack);

  server.close(() => {
    console.log("Server closed due to uncaught exception");
    process.exit(1);
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
    process.exit(0);
  });
});

module.exports = server;
