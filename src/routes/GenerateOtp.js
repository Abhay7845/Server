const express = require("express");
const router = express.Router();
const twilio = require("twilio");

const accountSid = "AC87c4448d2dacc9bce7b75f78e9606b66";
const authToken = "5fc3fb4937bb24a05ea691183c41797f";
const twilioPhone = +19519042773;
const client = new twilio(accountSid, authToken);

router.post("/send-otp", async (req, res) => {
  const { phoneNumber } = await req.body;
  if (!phoneNumber) {
    return res
      .status(404)
      .send({ success: false, message: "phone number is required" });
  }
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
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
        console.error(error);
        res.status(500).json({ error: "Failed to send OTP" });
      });
  } catch (error) {
    console.log("error=>", error);
  }
});

module.exports = router;
