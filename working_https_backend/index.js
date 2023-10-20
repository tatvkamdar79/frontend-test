const https = require("https");
const express = require("express");
const fs = require("fs");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://192.168.0.109:5173"); // Allow requests from any origin (not recommended in production)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (req, res) => {
  console.log("HERE");
  res.json({ message: "Hello from the backend!" });
});

const options = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost.pem"),
};

const server = https.createServer(options, app);

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
