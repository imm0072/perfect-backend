const { isValidObjectId } = require("mongoose");
const { UserModel } = require("../models/UserModal");

module.exports.createUser = async (data) => {
  const user = await UserModel.create(data);
  const { password: psw, ...safeUser } = user.toObject();
  return safeUser;
};
module.exports.updateUser = async (id, data) => {
  return UserModel.findAndUpdate({ _id: id }, data);
};

module.exports.deleteUser = async (id, data) => {
  return UserModel.findAndDelete({ _id: id });
};

module.exports.findUser = async (id) => {
  return await UserModel.findOne(
    {
      $or: [
        { _id: isValidObjectId(id) ? id : null },
        { email: id },
        { username: id },
      ],
    },
    { tokenVersion: 0, password: 0 }
  );
};
module.exports.updateUserPassword = async (id, password) => {
  return await UserModel.findAndUpdate({ _id: id }, { password });
};
module.exports.findUsers = async (pipeline) => {
  return await UserModel.aggregate([
    ...pipeline,
    { $match: {} },
    {
      $project: {
        password: 0,
        tokenVersion: 0,
      },
    },
  ]);
};
