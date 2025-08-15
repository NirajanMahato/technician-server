const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleOAuthLogin,
  uploadProfileImage,
  updateProfileImage,
  getUserProfile,
} = require("../controllers/userController");
const {
  registerValidator,
  googleLoginValidator,
  loginValidator,
} = require("../validators/userValidators");
const auth = require("../middlewares/auth");
const { upload } = require("../middlewares/upload");

// Auth endpoints
router.post("/register", registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);
router.post("/google", googleLoginValidator, googleOAuthLogin);

// Profile endpoints
router.get("/profile", auth, getUserProfile);
router.post("/upload-profile-image", auth, upload.single("image"), uploadProfileImage);
router.put("/update-profile-image", auth, upload.single("image"), updateProfileImage);

module.exports = router;
