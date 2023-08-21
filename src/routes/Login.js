const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/Users");
const loginValidation = require("../validation/Login");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JWT_SECRET = "AryanIsGoodBoy";

const loginTime = Date();
// LOGIN USE API
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

// LOGIN WITH GOOGLE API
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "632374650147-qgk47m10ks6td9r45j3q6fgnat8ncc6s.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("accessToken==>", accessToken);
      console.log("refreshToken==>", refreshToken);
      return done(null, profile);
    }
  )
);
// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Create callback route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect or respond with user data
    res.json(req.user);
  }
);

module.exports = router;
