const { UserModel } = require("../models/UserModal");
const { userService } = require("../services");
const { getProperty } = require("../util/utils");
const getUser = async (req, res) => {
  const id = getProperty(req, "id");

  console.log("id",id)
  const user = await userService.findUser(id);
  if (!user) {
    return res.status(404).json({message:"User not Found."});
  }
  return res.status(200).json({ user });
};
const getUsers = async (req, res) => {
  const users = await userService.findUsers([]);
  return res.status(200).json(users);
};
const createUser = async (req, res) => {
  const username = getProperty(req, "username");
  const email = getProperty(req, "email");
  const role = getProperty(req, "role");
  const password = getProperty(req, "password");
  const user = await userService.createUser({
    username,
    email,
    role,
    password,
  });
  const { password: psw, ...data } = user;
  return res.status(200).json(data);
};

const updateUser = async (req, res) => {
  const key=getProperty(req,"id");
  const username = getProperty(req, "username");
  const email = getProperty(req, "email");
  const role = getProperty(req, "role"); 
  const user = await userService.updateUser(key,{
    username,
    email,
    role, 
  });
  const { password: psw, ...data } = user;
  return res.status(200).json(data);
};
const deleteUser = async (req, res) => {
  return res.status(200);
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
