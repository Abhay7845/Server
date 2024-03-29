const { body } = require("express-validator");

const userContacts = [
  body("yourName", "Name is required").isLength({ min: 3 }),
  body("phone", "Phone is required").isLength({ min: 10 }),
  body("message", "message is required").isLength({ min: 5 }),
];

module.exports = userContacts;
