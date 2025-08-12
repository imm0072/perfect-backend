const express = require("express");
const { AuthController } = require("../controller");
const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: Sign In API
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: user-123
 *               password:
 *                 type: string
 *                 example: "********"
 *     responses:
 *       200:
 *         description: Successful SignIn. Sets HTTP-only refresh token cookie.
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only refresh token cookie
 *             schema:
 *               type: string
 *               example: rf=refresh-token; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict; Secure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthorized:
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6899854ff4cec1f6d453f745"
 *                     username:
 *                       type: string
 *                       example: "swt"
 *                     email:
 *                       type: string
 *                       example: "swt@gmail.com"
 *                     role:
 *                       type: string
 *                       example: "Admin"
 *       400:
 *         description: Bad request — Missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Username and password are required."
 *       401:
 *         description: Unauthorized — Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid username or password."
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong. Please try again later."
 */

router.post("/signin", AuthController.signin);
/**
 * @swagger
 * /api/v1/auth/signout:
 *   post:
 *     summary: Signout API.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Signout Successful.
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                  type: string
 *                  example: Signout Successful..
 *  
 */
router.post("/signout", AuthController.signout);
/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh Token API
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                         
 */
router.post("/refresh-token", AuthController.refreshToken);

module.exports = router;
