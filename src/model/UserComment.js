const mongoose = require("mongoose");

const Comment = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  comment: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("comment", Comment);
