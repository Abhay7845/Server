const mongoose = require("mongoose");

const users = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  profile: {
    type: String,
    require: false,
  },
  password: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Users = mongoose.model("user", users);
Users.createIndexes();
module.exports = Users;
