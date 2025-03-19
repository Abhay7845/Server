const mongoose = require("mongoose");

const UserImages = new mongoose.Schema({
  profileImg: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("userprofiles", UserImages);
