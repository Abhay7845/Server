const mongoose = require("mongoose");

const ContactUs = new mongoose.Schema({
  yourName: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ContactUs", ContactUs);
