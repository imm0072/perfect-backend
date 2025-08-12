// util/crypto.js
const crypto = require("crypto");
const config = require("../config"); // ensure you have HASH_SECRET in config/env

const HASH_SECRET = config.TOKEN_HASH_SECRET || process.env.TOKEN_HASH_SECRET;
if (!HASH_SECRET) {
  console.warn("TOKEN_HASH_SECRET not set — set a strong secret in env for refresh token hashing");
}

const hashToken = (token) => {
  return crypto.createHmac("sha256", HASH_SECRET).update(token).digest("hex");
};

module.exports = { hashToken };
