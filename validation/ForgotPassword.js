const { body } = require("express-validator");

const forgotValidation = [
  body("email").isEmail().withMessage("not a valid email"),
  body("newPassword").exists().withMessage("not a valid password"),
  body("conPassword").exists().withMessage("not a valid password"),
];

module.exports = forgotValidation;
