// controller/AuthController.js

/**
 * AuthController
 * Handles user authentication: sign in, sign out, and token refresh.
 * Implements:
 *   - Access token issuance (short-lived, stored in memory on client)
 *   - Refresh token issuance & rotation (long-lived, stored in DB & httpOnly cookie)
 *   - Device/IP/User-Agent binding for refresh tokens (added in verifyJWT)
 *   - Refresh token revocation on logout
 *   - Token rotation to prevent reuse attacks
 */

const { RefreshTokenModal } = require("../models/RefreshToken");
const { getProperty } = require("../util/utils");
const { authService, userService } = require("../services");
const constants = require("../constant");
const { getJWT, verifyJWT } = require("../util/jwt");
const { hashToken } = require("../util/crypto");
const config = require("../config");
const constant = require("../constant");

const COOKIE_OPTIONS = (secure) => ({
  httpOnly: true, // Prevent JS access to cookie (XSS protection)
  secure: secure, // Send only over HTTPS in production
  sameSite: "Strict", // Mitigate CSRF
  maxAge: 24 * 60 * 60 * 1000, // 1 day lifetime
});

/**
 * Sign in a user
 * Steps:
 *  1. Identify user by email, username, or ID
 *  2. Verify password
 *  3. Issue short-lived access token (JWT)
 *  4. Issue long-lived refresh token (JWT stored in DB as hash)
 *  5. Send refresh token in secure httpOnly cookie
 */
const signin = async (req, res) => {
  try {
    const id =
      getProperty(req, "email") ??
      getProperty(req, "username") ??
      getProperty(req, "id") ??
      null;
    const password = getProperty(req, "password") ?? null;   
    if (
      typeof id != "string" ||
      typeof password != "string" ||
      id.trim() == "" ||
      password.trim() == ""
    ) {
      return res
        .status(400)
        .json({ message: "please enter  username or password." });
    }
    const { user, isAuthorized } = await authService.findUserAndComparePassword(
      id,
      password
    );

    if (!isAuthorized || !user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const accessToken = await getJWT(req, user, constants.ACCESS_TOKEN);
    const rfTK = await getJWT(req, user, constants.REFRESH_TOKEN);

    res.cookie(
      constants.COOKIE_NAME,
      rfTK,
      COOKIE_OPTIONS(config.NODE_ENV === "production")
    );

    return res.status(200).json({ isAuthorized, accessToken, user });
  } catch (err) {
    console.error("signin error:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

/**
 * Sign out a user
 * Steps:
 *  1. Look up refresh token from cookie
 *  2. Delete refresh token from DB (revocation)
 *  3. Clear refresh token cookie
 */
const signout = async (req, res) => {
  try {
    const rf = req.cookies?.[constants.COOKIE_NAME];
    if (rf) {
      try {
        await RefreshTokenModal.deleteOne({ hash: hashToken(rf) });
      } catch (e) {
        console.warn("Failed to delete refresh token on signout:", e);
      }
    }
    res.clearCookie(
      constants.COOKIE_NAME,
      COOKIE_OPTIONS(config.NODE_ENV === "production")
    );
    return res.status(200).json({ message: "Signout Successful." });
  } catch (err) {
    console.error("signout error:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

/**
 * Refresh tokens (rotation)
 * Steps:
 *  1. Get refresh token from cookie
 *  2. Verify token signature & match against DB (device/IP/User-Agent binding)
 *  3. Delete old refresh token from DB (rotation)
 *  4. Issue new refresh token & access token
 *  5. Send new refresh token in cookie & new access token in response
 */
const refreshToken = async (req, res) => {
  try {
    const rf = req.cookies?.[constants.COOKIE_NAME];
    if (!rf) return res.status(401).json({ msg: "No refresh token" });

    const data = await verifyJWT(req, rf, constant.REFRESH_TOKEN);

    if (!data) {
      return res.status(402).json({ msg: "Invalid Session." });
    }

    try {
      await RefreshTokenModal.deleteOne({ hash: hashToken(rf) });
    } catch (e) {
      console.warn("Could not delete old refresh token during rotation:", e);
    }
    const user = await userService.findUser(data.id);
    const newRfTK = await getJWT(req, user, constant.REFRESH_TOKEN);
    const newAccessToken = await getJWT(req, user, constant.ACCESS_TOKEN);

    res.cookie(
      constants.COOKIE_NAME,
      newRfTK,
      COOKIE_OPTIONS(config.NODE_ENV === "production")
    );

    return res.status(200).json({ message: "OK", accessToken: newAccessToken });
  } catch (err) {
    console.error("refreshToken error:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  signin,
  signout,
  refreshToken,
};
