const mongoose = require("mongoose");
const config = require("../config");

const connect = async () => {
  try {
    await mongoose.connect(config.DB);
    console.log("Connected to DB.")
    return true;
  } catch (error) {
    return false;
  }
};
const disconnect = async () => {
  try {
    await mongoose.disconnect();
     console.log("Disconnected to DB.")
    return true;
  } catch (error) {
    return false;
  }
};
module.exports = { connect, disconnect };
