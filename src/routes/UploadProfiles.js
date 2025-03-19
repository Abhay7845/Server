const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const UserImages = require("../model/UserImage");
const fetchUser = require("../middleware/FetchUser");

// <----------------------------UPDATE USER FROFILE-------------------------->
const ImgStorage = multer.diskStorage({
  destination: "./upload/img",
  filename: (req, file, callBack) => {
    return callBack(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const uploadImg = multer({ storage: ImgStorage });

// API Route to Upload Profile Image with Text Fields
router.post(
  "/upload/profile",
  uploadImg.single("profileImg"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(200)
          .send({ status: false, message: "please select file" });
      }
      const imgUrl = `http://localhost:8000/api/user/${req.file.filename}`;
      const profile = await UserImages.create({
        profileImg: imgUrl,
      });
      if (profile) {
        res
          .status(200)
          .send({ code: 1000, message: "profile uploaded successfully" });
      }
    } catch (error) {
      return res.status(500).send({ code: 500, message: error.message });
    }
  }
);

// API to Get User Profile with Image
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserImages.findById(userId);
    console.log("user==>", user);
    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).send({ code: 1000, imgUrl: user.profileImg });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

module.exports = router;
