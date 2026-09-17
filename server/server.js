require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// Configure dynamic CORS to support Vercel production (https://aicte-lovat.vercel.app) and localhost
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const configured = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
        : ["*"];

      if (
        configured.includes("*") ||
        configured.includes(origin) ||
        origin.includes("vercel.app") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "x-n8n-chat-url",
    ],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/temples", require("./routes/temples"));
app.use("/api/monastries", require("./routes/temples")); // Backward-compatibility alias
app.use("/api/events", require("./routes/events"));
app.use("/api/hotels", require("./routes/hotels"));
app.use("/api/itineraries", require("./routes/itineraries"));
app.use("/api/chat-bot", require("./routes/chatbot"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/announcements", require("./routes/announcements"));
app.use("/api/support", require("./routes/support"));
app.use("/api/places", require("./routes/places"));
app.use("/api/tourism", require("./routes/tourism"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Mahakal Temple Express API" });
});
app.post("/api/health", (req, res) => {
  console.log("=== FRONTEND ERROR LOG ===");
  console.log(req.body);
  console.log("==========================");
  res.json({ status: "received" });
});

// Serve static client build files & handle SPA wildcard fallback (Unified Production Deployment)
const fs = require("fs");
const distPath = path.join(__dirname, "../client/dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const server = app.listen(PORT, HOST, () => {
  console.log(`Mahakal Node.js Server running on http://127.0.0.1:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(
      `\n[NOTICE] Port ${PORT} is already in use by an active Mahakal server instance. The backend server is currently running and active!`,
    );
  } else {
    console.error("Server error:", err);
  }
});
