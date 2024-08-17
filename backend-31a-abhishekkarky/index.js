const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const https = require("https");
const fs = require("fs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

dotenv.config();

app.use(express.json({ limit: "40mb" }));
app.use(express.urlencoded({ limit: "40mb", extended: true }));

// Apply Helmet to set security-related HTTP headers
app.use(helmet());

// Rate limiting to prevent abuse of API
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS configuration
const corsPolicy = {
  origin: process.env.CORS_ORIGIN || "*", // Adjust CORS origin policy as needed
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsPolicy));

// Serve static files securely
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

// Connect to database
connectDB();

const port = process.env.PORT || 443;
const sslKeyPath = path.resolve(__dirname, process.env.SSL_KEY);
const sslCertPath = path.resolve(__dirname, process.env.SSL_CRT);

// Load SSL certificate and key
let sslOptions = {
  key: fs.readFileSync(sslKeyPath),
  cert: fs.readFileSync(sslCertPath),
};

// Define routes
app.get("/", (req, res) => {
  res.send("Hello HTTPS!");
});

// User routes
app.use("/api/user", require("./routes/userRoutes"));

// Subscriber routes
app.use("/api/subscriber", require("./routes/subscriberRoutes"));

// Group routes
app.use("/api/group", require("./routes/groupRoutes"));

// Broadcast routes
app.use("/api/broadcast", require("./routes/broadcastRoutes"));

// Create HTTPS server
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`HTTPS Server is running on port ${port}`);
});

module.exports = app;
