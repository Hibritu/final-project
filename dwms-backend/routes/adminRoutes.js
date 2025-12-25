const express = require("express");
const router = express.Router();
const authenticate = require("../Middleware/authMiddleware");
const authorize = require("../Middleware/roleMiddleware");

router.get(
  "/admin-dashboard",
  authenticate,
  authorize("Admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

module.exports = router;
