const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const User = require("../model/Users");
const nodemailer = require("nodemailer");

const accountSid = "AC87c4448d2dacc9bce7b75f78e9606b66";
const authToken = "5fc3fb4937bb24a05ea691183c41797f";
const twilioPhone = "+19519042773";
const client = twilio(accountSid, authToken);

const emailConfig = {
  service: "your_email_service_provider",
  auth: {
    user: "your_email@example.com",
    pass: "your_email_password",
  },
};

const transporter = nodemailer.createTransport(emailConfig);

router.post("/send-otp/by/phone", async (req, res) => {
  const { phoneNumber } = await req.body;
  console.log("phoneNumber==>", phoneNumber);
  const otp = Math.floor(100000 + Math.random() * 900000);
  if (!phoneNumber) {
    return res
      .status(404)
      .send({ success: false, message: "phone number is required" });
  }
  try {
    client.messages
      .create({
        body: `Your OTP is: ${otp}`,
        from: twilioPhone,
        to: phoneNumber,
      })
      .then((message) => {
        console.log(message.sid);
        res.json({ message: "OTP sent successfully." });
      })
      .catch((error) => {
        console.log("error1==>", error);
        res.status(500).json({ error: "Failed to send OTP" });
      });
  } catch (error) {
    console.log("error=>", error);
  }
});

router.post("/send-otp/by/email", async (req, res) => {
  const { email } = await req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ success: false, message: "invalid email" });
    } else {
      const mailOptions = {
        from: "your_email@example.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email==>", error);
          return res.status(500).json({ message: "Failed to send OTP email" });
        } else {
          console.log("Email sent==>", info.response);
          res.json({
            success: true,
            message: "OTP has been sent successfully",
            otp: otp,
          });
        }
      });
    }
  } catch (error) {
    console.log("error==>", error);
  }
});

module.exports = router;
