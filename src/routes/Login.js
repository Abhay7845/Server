const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/Users");
const loginValidation = require("../validation/Login");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "AryanIsGoodBoy";

const loginTime = Date();
// LOGIN USE API
router.post("/login", loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  const { email, password } = await req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: "Sorry!  please register with us" });
    }
    const comparePassword = bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).send({ success: false, error: "Sorry!  password dose not matched" });
    }
    const data = {
      user: user,
    };
    const token = jwt.sign(data, JWT_SECRET);
    res.json({
      success: true,
      message: "login successfully",
      user,
      token,
      loginTime,
    });
  } catch (error) {
    return res.status(500).send("user doesn't login");
  }
});

// LOGIN WITH GOOGLE API

router.get("/login/success/:email", async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email });
  const data = {
    user: user,
  };
  const token = jwt.sign(data, JWT_SECRET);
  if (user) {
    res.status(200).send({
      success: true,
      massage: "login successfully",
      user,
      token: token,
    });
  } else if (!user) {
    return res.status(403).send({ success: false, massage: "user not authorized" });
  }
});

module.exports = router;
