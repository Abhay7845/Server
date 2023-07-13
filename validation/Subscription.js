const { body } = require("express-validator");

const userSubscription = [
  body("email").isEmail().withMessage("not a valid email"),
  body("comment", "Comment is required").isLength({ min: 20 }),
];

module.exports = userSubscription;
