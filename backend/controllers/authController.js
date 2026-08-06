const User = require("../models/User");
const PasswordOtp = require("../models/PasswordOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (req, res) => {
  const { full_name, email, phone, password } = req.body;

  if (!full_name || !email || !phone || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({
      $or: [
        { email },
        { phone }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      full_name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

exports.sendOtp = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found with this email",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await PasswordOtp.create({
      email,
      otp,
      expiresAt,
      isVerified: false,
    });

    await sendEmail({
      to: email,
      subject: "Globerra Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `<h3>Globerra Password Reset</h3><p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    });

    res.json({
      message: "OTP sent successfully to your email",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to send OTP",
    });

  }

};

exports.verifyOtp = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const otpData = await PasswordOtp.findOne({
      email,
      otp,
      expiresAt: {
        $gt: new Date(),
      },
    }).sort({ createdAt: -1 });

    if (!otpData) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    otpData.isVerified = true;

    await otpData.save();

    res.json({
      message: "OTP verified successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

exports.resetPassword = async (req, res) => {

  try {

    const { email, newPassword } = req.body;

    const otpData = await PasswordOtp.findOne({
      email,
      isVerified: true,
    }).sort({ createdAt: -1 });

    if (!otpData) {
      return res.status(400).json({
        message: "OTP not verified",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      }
    );

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};