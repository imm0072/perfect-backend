const { isValidObjectId } = require("mongoose");
const { UserModel } = require("../models/UserModal");
const { compare } = require("../util/bcrypt");
/**
 * @param id user id it can be _id ,username,email must be unique user key.
 * @param key key is the simple password of the user.\
 * @returns {user,isAuthorized}
 * @Error if something went wrong.
 *
 */
module.exports.findUserAndComparePassword = async (id, key) => {
  const query = {};
  query["$or"] = [];
  if (isValidObjectId(id)) {
    query["$or"].push({ _id: id });
  } else {
    query["$or"].push({ email: id });
    query["$or"].push({ username: id });
  }
  const user = await UserModel.findOne(query).lean();

  if (!user) return { isAuthorized: false, user: null };
  const { __v, password: hash, ...data } = user;
  const isAuthorized = await compare(key, hash);
  return { user: data, isAuthorized };
};
