const express = require("express");
const router = express.Router();
const subscription = require("../model/Subscription");
const SubscriptionValidation = require("../validation/Subscription");
const { validationResult } = require("express-validator");
const userContactsValidation = require("../validation/Subscription");
const ContatctUs = require("../model/ContatctUs");

// COMMENT API -5
router.post("/comment", SubscriptionValidation, async (req, res) => {
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

// CONTACT WITH US
router.post("/contact/with/us", userContactsValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ success: false, errors: errors.array() });
  }
  try {
    const { yourName, phone, massage } = await req.body;
    const contactUsers = await ContatctUs.create({
      yourName: yourName,
      phone: phone,
      massage: massage,
    });
    res.status(200).send({
      success: true,
      message: "sent successfully",
      contactUs: contactUsers,
    });
  } catch (error) {
    console.log("error==>", error);
    return res.status(400).send({ success: false, message: "Not Subscribed" });
  }
});

module.exports = router;
