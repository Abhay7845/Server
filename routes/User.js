/** @format */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/Users");
const AddUser = require("../model/AddUser");
const addUserValidation = require("../validation/addUser");
const subscription = require("../model/Subscription");
const registerValidation = require("../validation/Register");
const loginValidation = require("../validation/Login");
const SubscriptionValidation = require("../validation/Subscription");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var fetchUser = require("../middleware/FetchUser");
const forgotValidation = require("../validation/ForgotPassword");

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
      return res.status(400).json({
        success: false,
        massage: "sorry! Email is already registered",
      });
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
    res.send({
      success: true,
      message: "user registered successfully",
      user,
      token,
      loginTime,
    });
  } catch (error) {
    console.log("error==>", error);
    res.status(500).send({ success: false, message: "user not register" });
  }
});

// LOGIN ROUTER :-2
router.post("/login", loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  const { email, password } = await req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Sorry!  please register with us" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res
        .status(400)
        .send({ success: false, error: "Sorry!  password dose not matched" });
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
    console.log("error==>", error);
    res.status(500).send("user doesn't login");
  }
});

// FETCH USER DETAILS ROUTES -3
router.get("/fetchUser", fetchUser, async (req, res) => {
  try {
    const userId = await req.body.user._id;
    const user = await User.findById(userId).select("-password");
    res.status(200).send({
      success: true,
      message: user ? "user fetched successfully" : "invalid token",
      data: user ? user : undefined,
    });
  } catch (error) {
    console.log("error==>", error);
    res.status(500).send("user not found");
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
    res
      .status(200)
      .send({ success: true, message: "user added successfully", addUser });
  } catch (error) {
    console.log("error==>", error);
    res.status(400).send({ success: false, message: "user not added" });
  }
});

// FETCH ADD USER DETAILS ROUTES -5
router.get("/fetchAddUser", fetchUser, async (req, res) => {
  try {
    let addUserData = await AddUser.find({ user: req.body.user });
    if (addUserData.length > 0) {
      res.status(200).send({
        success: true,
        message: "user fetched successfully",
        addUserData,
      });
    } else {
      res.status(400).json({ success: false, error: "add users Not Found" });
    }
  } catch (error) {
    console.log("error==>", error);
    res.status(400).send({ success: false, message: "user not found" });
  }
});

//FETCH ADD USER BY ID
router.get("/fetch/AddUser/:id", async (req, res) => {
  try {
    const AddedUser = await AddUser.findById(req.params.id);
    if (!AddedUser) {
      return res
        .status(400)
        .send({ success: false, message: "added user Not found" });
    } else {
      res.status(200).send({
        success: true,
        message: "added user fetched successfully",
        AddedUser,
      });
    }
  } catch (error) {
    console.log("error==>", error);
    res.status(400).send({ success: false, message: "user not found" });
  }
});

// SUBSCRIPTION API -5
router.post("/subscription", SubscriptionValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ success: false, errors: errors.array() });
  }
  try {
    const { email, comment } = await req.body;
    const subscriber = await subscription.create({ email, comment });
    res.status(200).send({
      success: true,
      message: "user Subscribed successfully",
      subscriber,
    });
  } catch (error) {
    console.log("error==>", error);
    res.status(400).send({ success: false, message: "Not Subscribed" });
  }
});

// FETCH SUBSCRIPTION COMMENT API -6
router.get("/fetch/comment", async (req, res) => {
  try {
    let comments = await subscription.find({ user: req.body.id });
    res.status(200).send({
      success: true,
      message: "comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.log("error==>", error);
    res.status(400).send({ success: false, message: "subscription not found" });
  }
});

// DELETE ADD USERS API -7
router.delete("/delete/user/:id", async (req, res) => {
  try {
    const deleteId = await AddUser.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res
        .status(400)
        .send({ success: false, message: "data not found" });
    }
    res.status(200).send({
      success: true,
      message: "data has been deleted successfully",
      data: deleteId,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
});

// UPDATE ADD USERS API -8
router.put("/update/user/:id", async (req, res) => {
  try {
    const updateUser = await AddUser.findById(req.params.id);
    if (!updateUser) {
      return res
        .status(400)
        .send({ success: false, message: "user Not found" });
    } else {
      await AddUser.updateOne({
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
      res.status(200).send({
        success: true,
        message: "data has been updated successfully",
      });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
});

module.exports = router;

// FORGOT USER PASSWORD API -9
router.put("/forgot/password", forgotValidation, async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    const { email } = user;
    const checkMail = await req.body.email;
    const salt = await bcrypt.genSalt(10);
    const SecPassword = bcrypt.hashSync(req.body.conPassword, salt);
    if (email === checkMail) {
      user = await User.updateOne({
        password: SecPassword,
      });
      res.status(200).send({
        success: true,
        message: "password changed successfully",
      });
    } else if (email != checkMail) {
      return res.status(404).send({ success: false, message: "invalid email" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
});
