const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const accountSid = "AC87c4448d2dacc9bce7b75f78e9606b66";
const authToken = "5fc3fb4937bb24a05ea691183c41797f";
const twilioPhone = "+19519042773";
const client = twilio(accountSid, authToken);

const client_id =
  "517975281730-voasvrddq9f7bpd9pk025kqc7nfbdeq2.apps.googleusercontent.com";
const client_secret = "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";
const redirect_url = "https://developers.google.com/oauthplayground";
const refress_token =
  "1//04eE8bdlMcnXBCgYIARAAGAQSNwF-L9Irp81PJHibaan2RxZolxd3JmenOM7SQiOxrCYKCJ3nhQlQ41YZo0xbzhzMATctv6CxqJA";

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

// SEND OTP BY EMAIL API

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_url
);
oAuth2Client.setCredentials({ refresh_token: refress_token });

router.post("/send-otp/by/email", async (req, res) => {
  const { email } = await req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  if (!email) {
    return res
      .status(404)
      .send({ success: false, message: "email is required" });
  }
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "iteanzabhaykumar@titan.co.in",
        clientId: client_id,
        clientSecret: client_secret,
        refreshToken: refress_token,
        accessToken: accessToken,
      },
    });
    const sendMailOptions = {
      from: "The Aryan Group Pvt. Ltd. <iteanzabhaykumar@titan.co.in>",
      to: email,
      subject: "Verify Your Email OTP",
      text: `Dear User, A sign in attempt requires further verification because we did not recognize your device. To complete the sign in, enter the verification code on the unrecognized device.
 Your Verification Code - ${otp}`,
    };
    const result = await transporter.sendMail(sendMailOptions);
    if (result) {
      res.status(200).send({
        success: true,
        massage: "OTP has been sent successfly",
        otp: otp,
      });
    }
  } catch (error) {
    console.log("error==>", error);
  }
});

module.exports = router;
