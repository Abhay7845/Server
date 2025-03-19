const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const messagebird = require("messagebird").initClient(
  "zMVhu4ChdHgdNdPMLOXDK6vYw"
);

// EMAIL REQUIRED DATA
const client_id =
  "517975281730-voasvrddq9f7bpd9pk025kqc7nfbdeq2.apps.googleusercontent.com";
const client_secret = "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";
const redirect_url = "https://developers.google.com/oauthplayground";
const refress_token =
  "1//04eE8bdlMcnXBCgYIARAAGAQSNwF-L9Irp81PJHibaan2RxZolxd3JmenOM7SQiOxrCYKCJ3nhQlQ41YZo0xbzhzMATctv6CxqJA";

// SEND OTP BY PHONE NUMBER
router.post("/send-otp/by/phone", async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const { phoneNumber } = await req.body;
  const newPhoneNo = `+91${phoneNumber}`;
  if (!phoneNumber) {
    return res
      .status(200)
      .send({ success: false, message: "Phone number is required" });
  }
  try {
    const params = {
      template: `Dear User, Please Don't Share Your OPT with others, Your OTP is %token`,
      timeout: 600,
    };
    messagebird.verify.create(newPhoneNo, params, (err, success) => {
      if (success) {
        res.status(200).send({
          code: 1000,
          message: "OTP has been sent successfully",
          opt: otp,
        });
      }
      if (err) {
        return res.status(200).send({ code: 1001, message: "OTP not sent" });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: "Internal server error" });
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
  const otp = Math.floor(100000 + Math.random() * 900000);
  const { email } = await req.body;
  if (!email) {
    return res
      .status(200)
      .send({ success: false, message: "Email is required" });
  }
  function getUserName(email) {
    const nameMatch = email.match(/^(.+)@/);
    if (nameMatch && nameMatch.length > 1) {
      const name = nameMatch[1];
      const cleanName = name.replace(/[.+]/g, " ");
      const formattedName = cleanName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return formattedName;
    }
  }
  const userName = getUserName(email);
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
    const emailHtml = `
  <html>
    <body>
      <p>Dear<b style="color: blue;"> ${userName}</b>, <br/> <br/> Your One-Time Password (OTP) is: <b style="color: blue;">${otp}</b> From The Aryan Group Pvt. Ltd. for Website Verification, Verify your OTP and Get access.</p>
    </body>
  </html>
`;
    const sendMailOptions = {
      from: "The Aryan Group Pvt. Ltd. <iteanzabhaykumar@titan.co.in>",
      to: email,
      subject: "Verify Your Email OTP",
      html: emailHtml,
    };
    const result = await transporter.sendMail(sendMailOptions);
    if (result) {
      res.status(200).send({
        code: 1000,
        massage: "OTP has been sent successfully",
        otp: otp,
      });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Inernal server error" });
  }
});

module.exports = router;
