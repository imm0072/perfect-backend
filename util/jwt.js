/**
 * JWT Utility Module
 *
 * This module provides a secure, production-grade abstraction for issuing and verifying
 * both Access Tokens and Refresh Tokens using JSON Web Tokens (JWTs). It includes:
 *   - Secure token signing with algorithm selection
 *   - DB-backed refresh token storage (hashed for security)
 *   - Token rotation & replay attack prevention
 *   - Optional IP + User-Agent binding for session hardening
 *   - tokenVersion checks for instant token revocation
 *
 * Access Tokens:
 *   - Short-lived (default: 15m)
 *   - Stateless (not stored in DB)
 *   - Used for authorizing API requests
 *
 * Refresh Tokens:
 *   - Longer-lived (default: 1d)
 *   - Stored hashed in DB (never store raw token)
 *   - Rotated on each refresh request (old token is deleted)
 *   - Bound to client metadata (IP, User-Agent) if enabled
 *
 * Author: Your Name
 * Date: YYYY-MM-DD
 */

const jwt = require("jsonwebtoken");
const config = require("../config");
const constant = require("../constant");
const { RefreshTokenModal } = require("../models/RefreshToken");
const { UserModel } = require("../models/UserModal");
const { hashToken } = require("./crypto"); // Secure hash util for token persistence
const logger = console; // TODO: Replace with pino/winston logger in production

/**
 * Token configuration per type
 */
const TOKEN_CONFIG = {
  [constant.ACCESS_TOKEN]: {
    secret: config.JWT_SECRET_KEY_ACCESS_KEY,
    expiresIn: "15m",
  },
  [constant.REFRESH_TOKEN]: {
    secret: config.JWT_SECRET_KEY_REFRESH_KEY,
    expiresIn: "1d",
  },
};

/**
 * Signs a JWT token with minimal, safe payload.
 * @param {Object} payload - User data (must contain at least `id` or `_id` and `username`)
 * @param {string} type - Token type: ACCESS_TOKEN or REFRESH_TOKEN
 * @returns {string} Signed JWT string
 */
const signToken = (payload, type) => {
  const cfg = TOKEN_CONFIG[type];
  if (!cfg) throw new Error("Invalid token type");

  const safePayload = {
    id: payload._id ?? payload.id,
    username: payload.username,
    role: payload.role ?? "user",
    version: payload?.tokenVersion ?? 1,
  };

  return jwt.sign(safePayload, cfg.secret, {
    expiresIn: cfg.expiresIn,
    algorithm: "HS256",
  });
};

/**
 * Creates and persists a refresh token (hashed in DB for security).
 * Includes client IP & User-Agent for binding checks.
 * @param {Object} req - Express request object
 * @param {Object} user - User object (must contain id/_id)
 * @returns {Promise<string>} Raw refresh token string
 */
const createRefreshToken = async (req, user) => {
  const token = signToken(user, constant.REFRESH_TOKEN);

  await RefreshTokenModal.create({
    userId: user._id ?? user.id,
    hash: hashToken(token),
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    createdAt: new Date(),
  });

  return token;
};

/**
 * Verifies a JWT and enforces additional rules:
 *   - Access token: tokenVersion check for instant revocation
 *   - Refresh token: atomic DB removal (rotation) + IP/UA check
 * @param {Object} req - Express request object
 * @param {string} token - Raw JWT string from client
 * @param {string} type - Token type: ACCESS_TOKEN or REFRESH_TOKEN
 * @returns {Promise<Object|null>} Decoded payload if valid, else null
 */
const verifyToken = async (req, token, type) => {
  try {
    const cfg = TOKEN_CONFIG[type];
    if (!cfg) throw new Error("Invalid token type");

    if (type === constant.ACCESS_TOKEN) {
      const payload = jwt.verify(token, cfg.secret, { algorithms: ["HS256"] });

      const user = await UserModel.findById(payload.id).select("tokenVersion").lean();
      if (!user || (user.tokenVersion ?? 1) !== (payload.version ?? 1)) return null;

      return payload;
    }

    // Refresh token flow
    const tokenHash = hashToken(token);
    const stored = await RefreshTokenModal.findOneAndDelete({ hash: tokenHash }).lean();
    if (!stored) {
      logger.warn("Refresh token invalid or reused", { ip: req.ip, ua: req.get("User-Agent") });
      return null;
    }

    if (stored.ip && stored.ip !== req.ip) {
      logger.warn("IP mismatch", { expected: stored.ip, got: req.ip });
      return null;
    }
    if (stored.userAgent && stored.userAgent !== req.get("User-Agent")) {
      logger.warn("UA mismatch", { expected: stored.userAgent, got: req.get("User-Agent") });
      return null;
    }

    const payload = jwt.verify(token, cfg.secret, { algorithms: ["HS256"] });

    const user = await UserModel.findById(payload.id).select("tokenVersion").lean();
    if (!user || (user.tokenVersion ?? 1) !== (payload.version ?? 1)) return null;

    return payload;
  } catch (err) {
    logger.warn("JWT verification failed", { name: err.name, message: err.message });
    return null;
  }
};

module.exports = {
  getAccessToken: (user) => signToken(user, constant.ACCESS_TOKEN),
  getRefreshToken: createRefreshToken,
  getJWT: async (req, payload, type) => {
    if (type === constant.ACCESS_TOKEN) return signToken(payload, constant.ACCESS_TOKEN);
    if (type === constant.REFRESH_TOKEN) return createRefreshToken(req, payload);
    throw new Error("Invalid token type");
  },
  verifyJWT: async (req, token, type) => verifyToken(req, token, type),
};
