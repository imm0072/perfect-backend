// bcryptUtil.js
const bcrypt = require("bcrypt");
const config = require("../config");

/**
 * Hashes a key (typically a password) using bcrypt with a pepper and salt rounds.
 * The pepper is appended before hashing for additional security.
 *
 * @param {string} key - The plain text key (e.g., password) to be hashed.
 * @returns {Promise<string>} The hashed key.
 * @throws {Error} If the key is not a string.
 */
const hashKey = async (key) => {
  if (typeof key !== "string") {
    throw new Error("Key must be a string");
  }

  return await bcrypt.hash(config.BCRYPT_PEPPER + key, config.SALT_ROUNDS);
};

/**
 * Compares a plain key with its hashed version to verify authenticity.
 * The key is peppered before comparison.
 *
 * @param {string} key - The plain text key to compare.
 * @param {string} hash - The hashed key to compare against.
 * @returns {Promise<boolean>} True if match, false otherwise.
 * @throws {Error} If inputs are not strings.
 */
const compare = async (key, hash) => {
  if (typeof key !== "string" || typeof hash !== "string") {
    throw new Error("Key and hash must both be strings");
  }

  return await bcrypt.compare(config.BCRYPT_PEPPER + key, hash);
};

// Exporting utility functions
module.exports = {
  hashKey,
  compare,
};
