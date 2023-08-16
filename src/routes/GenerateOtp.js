const express = require("express");
const router = express.Router();
const twilio = require("twilio");
// Replace with your Twilio Account SID and Auth Token
const accountSid = "AC87c4448d2dacc9bce7b75f78e9606b66";
const authToken = "5fc3fb4937bb24a05ea691183c41797f";
const twilioPhone = +19519042773;
const client = new twilio(accountSid, authToken);

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// API endpoint to send OTP via SMS
router.post("/send-otp", async (req, res) => {
  const { phoneNumber } = await req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required." });
  }

  const otp = generateOTP();

  // Send OTP via Twilio
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
      res.status(500).json({ error: "Failed to send OTP." });
    });
});

module.exports = router;
