const User = require("../models/User");
const { validationResult } = require("express-validator");
const { sendMail } = require("../utils/email");
const welcomeTemplate = require("../utils/emailTemplates/welcome");
const env = require("../config/env_config");
const { OAuth2Client } = require("google-auth-library");
const { uploadImage, deleteImage } = require("../utils/cloudinary");
const fs = require("fs/promises");

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, phone, password } = req.body;

    const isUserAlready = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (isUserAlready) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await User.hashPassword(password);
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      phone,
    });

    const token = user.generateAuthToken();

    try {
      await sendMail({
        to: email,
        subject: "Welcome to Technician Booking",
        html: welcomeTemplate({
          name: fullname,
          dashboardUrl: env.FRONTEND_URL,
        }),
      });
    } catch (mailErr) {
      console.error("Registration email failed:", mailErr.message);
    }

    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(201).json({ token, user: safeUser });
  } catch (err) {
    res.locals.errorMessage = err.message;
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

// POST /api/v1/auth/login
exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = user.generateAuthToken();

    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({ token, user: safeUser });
  } catch (err) {
    res.locals.errorMessage = err.message;
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

// POST /api/v1/auth/google - expects { idToken: string } from client (Google One Tap or gapi auth)
exports.googleOAuthLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken)
      return res.status(400).json({ message: "idToken is required" });

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload || {};

    if (!email)
      return res
        .status(400)
        .json({ message: "Google token did not contain an email" });

    let user = await User.findOne({ email });

    if (!user) {
      const randomPass = Math.random().toString(36).slice(-12) + Date.now();
      const hashed = await User.hashPassword(randomPass);

      user = await User.create({
        fullname: name || "Google User",
        email,
        phone: "N/A",
        password: hashed,
        profileImage: picture || null,
        profileImagePublicId: null, // since not uploaded to our Cloudinary
      });
    } else if (!user.profileImage && picture) {
      user.profileImage = picture;
      user.profileImagePublicId = null;
      await user.save();
    }

    const token = user.generateAuthToken();

    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({ token, user: safeUser });
  } catch (err) {
    res.locals.errorMessage = err.message;
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

// GET /api/v1/user/profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message || "Internal Server Error" });
  }
};

// POST /api/v1/user/upload-profile-image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No image file provided" });

    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const result = await uploadImage(req.file.path, `users/${userId}`);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: result.secure_url,
        profileImagePublicId: result.public_id,
      },
      { new: true }
    ).lean();

    try {
      await fs.unlink(req.file.path);
    } catch {}

    return res.status(200).json({
      message: "Profile image uploaded",
      profileImage: user.profileImage,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message || "Profile image upload failed" });
  }
};

// PUT /api/v1/user/update-profile-image
exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No image file provided" });

    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findById(userId).select("profileImagePublicId");
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.profileImagePublicId) {
      try {
        await deleteImage(user.profileImagePublicId);
      } catch {}
    }

    const result = await uploadImage(req.file.path, `users/${userId}`);

    user.profileImage = result.secure_url;
    user.profileImagePublicId = result.public_id;
    await user.save();

    try {
      await fs.unlink(req.file.path);
    } catch {}

    return res.status(200).json({
      message: "Profile image updated",
      profileImage: user.profileImage,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message || "Profile image update failed" });
  }
};
