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
  if (!email) return res.status(200).send({ status: false, message: "email is required" });
  if (!password) return res.status(200).send({ status: false, message: "password is required" });
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(200).send({ success: false, error: "Sorry!  please register with us" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(200).send({ success: false, error: "Sorry! password dose not matched" });
    }
    const data = { user: user };
    const token = jwt.sign(data, JWT_SECRET);
    res.status(200).send({
      success: true,
      message: "login successfully",
      user,
      token,
      loginTime,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
});

// LOGIN WITH GOOGLE API

router.get("/login/success/:email", async (req, res) => {
  try {
    const email = await req.params.email;
    const user = await User.findOne({ email });
    const data = { user: user };
    const token = jwt.sign(data, JWT_SECRET);
    if (user) {
      res.status(200).send({ success: true, massage: "login successfully", user, token: token });
    } else if (!user) {
      return res.status(200).send({ success: false, massage: "user not authorized" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, massage: "Internal Servr Error" });
  }
});


module.exports = router;
