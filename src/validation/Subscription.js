const { body } = require("express-validator");

const userSubscription = [
  body("email").isEmail().withMessage("not a valid email"),
  body("comment", "Comment is required").isLength({ min: 20 }),
];

const userContacts = [
  body("yourName", "Name is required").isLength({ min: 3 }),
  body("phone", "Phone is required").isLength({ min: 10 }),
  body("massage", "massage is required").isLength({ min: 5 }),
];

module.exports = userSubscription;
module.exports = userContacts;
