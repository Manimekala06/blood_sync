const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const path = require("path");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const bloodRequestRoutes = require("./routes/bloodRequestRoutes");
const contactUsRoutes = require("./routes/contactUsRoutes");
const donorRoutes = require("./routes/donorRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const loginRoutes = require("./routes/loginRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { authenticate } = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/", (req, res) => {
  res.json({
    message: "BloodSync backend API",
    status: "running"
  });
});

const publicApiRoutes = [
  "/health",
  "/auth/register/donor",
  "/auth/register/hospital",
  "/auth/register/admin",
  "/auth/login"
];

app.use("/api", (req, res, next) => {
  const isPublicContactCreate = req.path === "/contact-us" && req.method === "POST";

  if (publicApiRoutes.includes(req.path) || isPublicContactCreate) {
    return next();
  }

  return authenticate(req, res, next);
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contact-us", contactUsRoutes);
app.use("/api/logins", loginRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Internal server error"
  });
});

module.exports = app;
