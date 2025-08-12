// models/RefreshToken.js
const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    hash: { type: String, required: true, unique: true, index: true },
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

// TTL index: remove documents older than refresh token lifetime (e.g., 1d)
const refreshTokenLifetimeSeconds = 24 * 60 * 60; // keep in sync with TOKEN_CONFIG REFRESH_TOKEN expiresIn
RefreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: refreshTokenLifetimeSeconds });

// Optional: query helpers / static methods
RefreshTokenSchema.statics.findByHash = function (hash) {
  return this.findOne({ hash });
};

module.exports.RefreshTokenModal = mongoose.model("RefreshToken", RefreshTokenSchema);
