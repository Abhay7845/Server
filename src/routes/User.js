const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/Users");
const AddUser = require("../model/AddUser");
const addUserValidation = require("../validation/addUser");
const registerValidation = require("../validation/Register");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var fetchUser = require("../middleware/FetchUser");

const JWT_SECRET = "AryanIsGoodBoy";

const loginTime = Date();
// REGISTER ROUTER :-1
router.post("/register", registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ success: false, errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(200).json({ success: false, massage: "sorry! Email is already registered" });
    }
    const salt = await bcrypt.genSalt(10);
    const SecPassword = bcrypt.hashSync(req.body.password, salt);
    // create users
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: SecPassword,
    });
    const data = {
      user: user,
    };
    const token = jwt.sign(data, JWT_SECRET);
    res.status(200).send({
      success: true,
      message: "user registered successfully",
      user,
      token,
      loginTime,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Interanl server error" });
  }
});

// FETCH USER DETAILS ROUTES -3
router.get("/fetchUser", fetchUser, async (req, res) => {
  try {
    const userId = await req.body.user._id;
    const user = await User.findById(userId).select("-password");
    res.status(200).send({ success: user ? true : false, message: user ? "user fetched successfully" : "Invalid token", data: user ? user : undefined });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

//ADD USER ROUTER - 4
router.post("/addUser", fetchUser, addUserValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ success: false, errors: errors.array() });
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
    res.status(200).send({ success: true, message: "user added successfully", addUser });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
});

// FETCH ADD USER DETAILS ROUTES -5
router.get("/fetchAddUser", fetchUser, async (req, res) => {
  try {
    let addUserData = await AddUser.find({ user: req.body.user });
    if (addUserData.length > 0) {
      res.status(200).send({ success: true, message: "user fetched successfully", addUserData });
    } else {
      res.status(200).json({ success: false, error: "added users not found" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
});

//FETCH ADD USER BY ID
router.get("/fetch/AddUser/:id", async (req, res) => {
  try {
    const AddedUser = await AddUser.findById(req.params.id);
    if (!AddedUser) {
      return res.status(200).send({ success: false, message: "added user Not found" });
    } else {
      res.status(200).send({ success: true, message: "added user fetched successfully", AddedUser });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
});

// DELETE ADD USERS API -7
router.delete("/delete/user/:id", async (req, res) => {
  try {
    const userData = await AddUser.findByIdAndDelete(req.params.id);
    if (!userData) {
      return res.status(200).send({ success: false, message: "data not found" });
    } else if (req.params.id) {
      res.status(200).send({ success: true, message: "data has been deleted successfully" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: "Internal Server error" });
  }
});

// UPDATE ADD USERS API -8
router.put("/update/user/:id", async (req, res) => {
  try {
    const updateUser = await AddUser.findById(req.params.id);
    if (!updateUser) {
      return res.status(200).send({ success: false, message: "user Not found" });
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
      res.status(200).send({ success: true, message: "data has been updated successfully" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
});

// FORGOT USER PASSWORD API -9
router.put("/forgot/password", async (req, res) => {
  const { email, conPassword } = await req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: false, error: "Invalid Email" });
    }
    const salt = await bcrypt.genSalt(10);
    const SecPassword = bcrypt.hashSync(conPassword, salt);
    await User.updateOne(
      { email },
      { password: SecPassword }
    );
    res.status(200).json({ success: true, message: "password reset successfully" });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
