require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("../config/db");

const ADMIN_EMAIL = "admin@dwms.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_NAME = "System Admin";
const ADMIN_ROLE = "Admin";

async function seedAdmin() {
  console.log(" ADMIN SEEDER FILE IS EXECUTING");

  try {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const query = `
      INSERT INTO users (name, email, password, role, is_verified)
      VALUES ($1, $2, $3, $4, true)
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        password = EXCLUDED.password,
        role = EXCLUDED.role,
        is_verified = true,
        updated_at = NOW();
    `;

    await pool.query(query, [
      ADMIN_NAME,
      ADMIN_EMAIL,
      hashedPassword,
      ADMIN_ROLE,
    ]);

    console.log(" Admin user seeded successfully:", ADMIN_EMAIL);
  } catch (err) {
    console.error(" Failed to seed admin user:", err.message);
  } finally {
    process.exit(0);
  }
}

seedAdmin();
