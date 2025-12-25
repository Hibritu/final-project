const express = require("express");
const {
  register,
  verifyOtp,
  login,
  ping,
} = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (Citizen, Collector, or MunicipalStaff) and send OTP to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hibritu Diress
 *               email:
 *                 type: string
 *                 example: hibritu@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 description: Must be one of [Citizen, Collector, MunicipalStaff]
 *                 example: Citizen
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       400:
 *         description: Invalid role
 *       500:
 *         description: Server error
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify email using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: hibritu@gmail.com
 *               otp:
 *                 type: integer
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
router.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and receive JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: hibritu@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid password
 *       403:
 *         description: Email not verified
 *       404:
 *         description: User not found
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/ping:
 *   get:
 *     summary: Swagger test endpoint
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Swagger working
 */
router.get("/ping", ping);

module.exports = router;