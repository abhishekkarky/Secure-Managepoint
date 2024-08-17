const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const https = require("https");
const fs = require("fs");

const app = express();

dotenv.config();

app.use(express.json({ limit: "40mb" }));
app.use(express.urlencoded({ limit: "40mb", extended: true }));

const corsPolicy = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsPolicy));

app.use("/uploads", (req, res, next) => {
  express.static(path.resolve(__dirname, "uploads"))(req, res, next);
});

connectDB();

const port = process.env.PORT || 443;
const sslKeyPath = path.resolve(__dirname, process.env.SSL_KEY);
const sslCertPath = path.resolve(__dirname, process.env.SSL_CRT);

// Load SSL certificate and key
let sslOptions = {
  key: fs.readFileSync(sslKeyPath),
  cert: fs.readFileSync(sslCertPath),
};

app.get("/", (req, res) => {
  res.send("Hello HTTPS!");
});

// creating user routes
app.use("/api/user", require("./routes/userRoutes"));

// creating subscriber routes
app.use("/api/subscriber", require("./routes/subscriberRoutes"));

// Creating group routes
app.use("/api/group", require("./routes/groupRoutes"));

// Creating broadcast routes
app.use("/api/broadcast", require("./routes/broadcastRoutes"));

// Create HTTPS server
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`HTTPS Server is running on port ${port}`);
});

module.exports = app;
