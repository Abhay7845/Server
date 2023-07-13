const mongoose = require("mongoose");

const Subscription = new mongoose.Schema({
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

module.exports = mongoose.model("subscription", Subscription);
