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
    res
      .status(200)
      .send({ code: 1000, message: "Commente sent successfully", subscriber });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
});

// FETCH  COMMENT API -6
router.get("/fetch/comment", async (req, res) => {
  try {
    let comments = await Comment.find({ user: req.body.id });
    if (comments.length > 0) {
      res.status(200).send({
        code: 1000,
        message: "Users comments fetched successfully",
        comments,
      });
    } else {
      res
        .status(200)
        .send({ code: 1001, message: "Comments not available", comments });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
});

// DELETE COMMENT API
router.delete("/delete/comment/:id", async (req, res) => {
  try {
    const comments = await Comment.findByIdAndDelete(req.params.id);
    if (!comments) {
      return res
        .status(200)
        .send({ code: 1001, message: "Comments not found" });
    } else if (req.params.id) {
      res
        .status(200)
        .send({ code: 1000, message: "Comment has been deleted successfully" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
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
      code: 1000,
      message: "Contact details sent successfully",
      contactUs: contactUsers,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
  }
});

module.exports = router;
