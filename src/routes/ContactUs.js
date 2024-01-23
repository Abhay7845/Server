const express = require("express");
const router = express.Router();
const Comment = require("../model/UserComment");
const userComment = require("../validation/UserComments");
const { validationResult } = require("express-validator");
const userContactsValidation = require("../validation/UserContact");
const ContatctUs = require("../model/ContatctUs");

// COMMENT API -5
router.post("/comment", userComment, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ success: false, errors: errors.array() });
  }
  try {
    const { email, comment } = await req.body;
    const subscriber = await Comment.create({ email, comment });
    res.status(200).send({
      success: true,
      message: "commented successfully",
      subscriber,
    });
  } catch (error) {
    return res.status(400).send({ success: false, message: "Not comment" });
  }
});

// FETCH  COMMENT API -6
router.get("/fetch/comment", async (req, res) => {
  try {
    let comments = await Comment.find({ user: req.body.id });
    res.status(200).send({
      success: true,
      message: "users comments fetched successfully",
      comments,
    });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "comment not found" });
  }
});

// CONTACT WITH US API
router.post("/contact/with/us", userContactsValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ success: false, errors: errors.array() });
  }
  try {
    const { yourName, phone, message } = await req.body;
    const contactUsers = await ContatctUs.create({
      yourName: yourName,
      phone: phone,
      message: message,
    });
    res.status(200).send({
      success: true,
      message: "sent successfully",
      contactUs: contactUsers,
    });
  } catch (error) {
    return res.status(400).send({ success: false, message: "Not Subscribed" });
  }
});

module.exports = router;
