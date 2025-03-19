const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/Users");
const AddUser = require("../model/AddUser");
const addUserValidation = require("../validation/addUser");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/FetchUser");
const JWT_SECRET = "AryanIsGoodBoy";

const loginTime = Date();
// REGISTER ROUTER :-1
router.post("/register", async (req, res) => {
  const { name, email, phone, password } = await req.body;
  if (!name)
    return res
      .status(200)
      .send({ success: false, message: "name is required" });
  if (!email)
    return res
      .status(200)
      .send({ success: false, message: "email is required" });
  if (!phone)
    return res
      .status(200)
      .send({ success: false, message: "phone is required" });
  if (!password)
    return res
      .status(200)
      .send({ success: false, message: "password is required" });
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(200)
        .json({ code: 1001, massage: "sorry! Email is already registered" });
    }
    const salt = await bcrypt.genSalt(10);
    const SecPassword = bcrypt.hashSync(password, salt);
    // create users
    user = await User.create({
      name: name,
      email: email,
      phone: phone,
      password: SecPassword,
    });
    const data = { user: user };
    const token = jwt.sign(data, JWT_SECRET);
    res.status(200).send({
      code: 1000,
      message: "user registered successfully",
      user,
      token,
      loginTime,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Interanl server error" });
  }
});

// FETCH USER DETAILS ROUTES -3

router.get("/user/profile", fetchUser, async (req, res) => {
  try {
    const userId = await req.body.user._id;
    const user = await User.findById(userId).select("-password");
    res
      .status(200)
      .send({ code: 1000, message: "user fetched successfully", data: user });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
});

// REGISTER BY EMAIL
router.get("/register/by/:email", async (req, res) => {
  const email = await req.params.email;
  const splitName = await email.split("@");
  const userName = splitName.join("").match(/[a-zA-Z]+/g) || [];
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(200)
        .json({ code: 1001, massage: "sorry! Email is already registered" });
    } else {
      user = await User.create({
        name: userName[0],
        email: email,
        phone: "",
        password: "",
      });
      const data = { user: user };
      const token = jwt.sign(data, JWT_SECRET);
      res.status(200).send({
        code: 1000,
        message: "user registered successfully",
        user,
        token,
        loginTime,
      });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, massage: "Internal Servr Error" });
  }
});

//ADD USER ROUTER - 4
router.post("/addUser", fetchUser, addUserValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).send({ code: 1002, errors: errors.array() });
  }
  try {
    const userId = await req.body.user._id;
    const {
      name,
      occupation,
      email,
      phone,
      country,
      state,
      city,
      postalCode,
      address,
    } = await req.body;
    const addUser = await AddUser.create({
      user: userId,
      name,
      occupation,
      email,
      phone,
      country,
      state,
      city,
      postalCode,
      address,
    });
    if (userId) {
      res
        .status(200)
        .send({ code: 1000, message: "User inserted successfully", addUser });
    } else {
      res
        .status(200)
        .send({ code: 1001, message: "User not inserted", addUser });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
});

// FETCH ADD USER DETAILS ROUTES -5
router.get("/get/added/user", fetchUser, async (req, res) => {
  try {
    let addUserData = await AddUser.find({ user: req.body.user });
    if (addUserData.length > 0) {
      res.status(200).send({
        code: 1000,
        message: "User fetched successfully",
        addUserData,
      });
    } else {
      res.status(200).json({ code: 1001, error: "Data not available" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
});

//FETCH ADD USER BY ID
router.get("/fetch/AddUser/:id", async (req, res) => {
  try {
    const AddedUser = await AddUser.findById(req.params.id);
    if (!AddedUser) {
      return res.status(200).send({ code: 1001, message: "Data not found" });
    } else {
      res
        .status(200)
        .send({ code: 1000, message: "Data fetched successfully", AddedUser });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
});

// DELETE ADD USERS API -7
router.delete("/delete/user/:id", async (req, res) => {
  try {
    const userData = await AddUser.findByIdAndDelete(req.params.id);
    if (!userData) {
      return res.status(200).send({ code: 1001, message: "Data not found" });
    } else if (req.params.id) {
      res
        .status(200)
        .send({ code: 1000, message: "Data has been deleted successfully" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
});

// UPDATE ADD USERS API -8
router.put(
  "/update/user/:id",
  fetchUser,
  addUserValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ code: 1002, errors: errors.array() });
    }
    try {
      const updateUser = await AddUser.findById(req.params.id);
      if (!updateUser) {
        return res.status(200).send({ code: 1001, message: "User not found" });
      } else {
        await AddUser.findByIdAndUpdate(updateUser._id, {
          name: req.body.name,
          occupation: req.body.occupation,
          email: req.body.email,
          phone: req.body.phone,
          country: req.body.country,
          state: req.body.state,
          city: req.body.city,
          postalCode: req.body.postalCode,
          address: req.body.address,
        });
        res
          .status(200)
          .send({ code: 1000, message: "Data has been updated successfully" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ code: 500, message: "Internal server error" });
    }
  }
);

// FORGOT USER PASSWORD API -9
router.put("/forgot/password", async (req, res) => {
  const { email, conPassword } = await req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ code: 1001, error: "User not found" });
    }
    const salt = await bcrypt.genSalt(10);
    const SecPassword = bcrypt.hashSync(conPassword, salt);
    await User.updateOne({ email }, { password: SecPassword });
    res
      .status(200)
      .json({ code: 1000, message: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
});

module.exports = router;
