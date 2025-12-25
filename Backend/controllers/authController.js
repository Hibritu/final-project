const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const sendEmail = require("../utils/sendEmail");

// Allowed roles for registration (Admin is seeded separately)
const ALLOWED_ROLES = ["Citizen", "Collector", "MunicipalStaff"];

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        error:
          "Invalid role. Allowed roles are Citizen, Collector, MunicipalStaff.",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date(Date.now() + 10 * 60000);

    await pool.query(
      `INSERT INTO users
       (name, email, password, role, otp_code, otp_expires)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [name, email, hashed, role, otp, expiry]
    );

    await sendEmail(
  email,
  "DWMS Email Verification",
  `Your OTP code is ${otp}. It expires in 10 minutes.`
);

    res.json({ message: "OTP sent to email. Please verify." });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }

    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (!user.rows.length)
      return res.status(404).json({ error: "User not found" });

    const dbUser = user.rows[0];

    if (dbUser.otp_code !== otp || new Date() > dbUser.otp_expires) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await pool.query(
      "UPDATE users SET is_verified=true, otp_code=NULL, otp_expires=NULL WHERE email=$1",
      [email]
    );

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (!result.rows.length)
      return res.status(404).json({ error: "User not found" });

    const user = result.rows[0];

    if (!user.is_verified)
      return res.status(403).json({ error: "Email not verified" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

const ping = (req, res) => {
  res.json({ message: "Swagger is working 🎉" });
};

module.exports = {
  register,
  verifyOtp,
  login,
  ping,
};
