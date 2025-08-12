const { request } = require("express");
const mongoose = require("mongoose");
const { hashKey } = require("../util/bcrypt");
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    default: `user-${Math.floor(Math.random() + 3 * 100)}`,
  },

  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  tokenVersion: {
    type: Number,
    required: true,
    default:1,
  },
});

UserSchema.index({ username: 1, email: 1 });
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashKey(this.password);
});

const UserModel = mongoose.model("Users", UserSchema);
module.exports = {
  UserSchema,
  UserModel,
};
