const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/Users");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "AryanIsGoodBoy";

const loginTime = Date();

// LOGIN USE API
router.post("/login", async (req, res) => {
  const { email, password } = await req.body;
  if (!email)
    return res
      .status(200)
      .send({ success: false, message: "email is required" });
  if (!password)
    return res
      .status(200)
      .send({ success: false, message: "password is required" });
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .send({ code: 1001, error: "Sorry! please register with us" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res
        .status(200)
        .send({ code: 1002, error: "Sorry! password dose not matched" });
    }
    const data = { user: user };
    const token = jwt.sign(data, JWT_SECRET);
    res.status(200).send({
      code: 1000,
      message: "login successfully",
      user,
      token,
      loginTime,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
});

// LOGIN WITH GOOGLE API
router.get("/login/by/:email", async (req, res) => {
  try {
    const email = await req.params.email;
    const user = await User.findOne({ email });
    const data = { user: user };
    const token = jwt.sign(data, JWT_SECRET);
    if (user) {
      res.status(200).send({
        code: 1000,
        massage: "login successfully",
        user,
        token: token,
      });
    } else if (!user) {
      return res
        .status(200)
        .send({ code: 1001, error: "Sorry! email is unauthorized" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, massage: "Internal Servr Error" });
  }
});

module.exports = router;
