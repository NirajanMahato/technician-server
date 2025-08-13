const User = require("../models/User");
const { validationResult } = require("express-validator");
const { sendMail } = require("../utils/email");
const welcomeTemplate = require("../utils/emailTemplates/welcome");
const env = require("../config/env_config");

exports.registerUser = async (req, res, next) => {
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
