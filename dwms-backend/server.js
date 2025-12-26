require("dotenv").config();
const express = require("express");
const cors = require("cors");

const pool = require("./src/config/db");
const { swaggerUi, specs } = require("./src/swagger");
const authRoutes = require("./src/routes/authRoutes");
const wasteRoutes = require("./src/routes/wasteRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("DWMS Backend Server Running");
});

// Database Test
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/waste", wasteRoutes);
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
