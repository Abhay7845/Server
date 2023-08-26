const express = require("express");
const router = express.Router();
const twilio = require("twilio");
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

// SEND OTP BY PHONE NUMBER
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

// SEND OTP BY EMAIL
router.post("/send-otp/by/email", async (req, res) => {
  const email = await req.body.email;
  if (!email) {
    return res
      .status(404)
      .send({ success: false, message: "email is required" });
  }
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let TestMailer = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "lesly2@ethereal.email",
        pass: "tUjs7HnUCatQQtjb3H",
      },
    });
    const info = await transporter.sendMail({
      from: "THE ARYAN GROUP <thearyangrouppvt@gmail.com>",
      to: email,
      subject: "Verify Your Email OTP",
      text: `Dear user, Congratulations Please verify your OTP, YOUR OTP is : ${otp}`,
    });
    console.log("Message sent==>", info.messageId);
    res.status(200).send({
      success: true,
      massage: "OTP has been sent successfly",
      otp: otp,
    });
  } catch (error) {
    console.log("error==>", error);
  }
});

module.exports = router;
