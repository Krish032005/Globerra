const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (req, res) => {
  const { full_name, email, phone, password } = req.body;

  if (!full_name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const checkSql = "SELECT * FROM users WHERE email = ? OR phone = ?";
    db.query(checkSql, [email, phone], async (checkErr, checkResult) => {
      if (checkErr) {
        return res.status(500).json({ message: "Server error" });
      }

      if (checkResult.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = "INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)";
      db.query(sql, [full_name, email, phone, hashedPassword], (err) => {
        if (err) {
          return res.status(500).json({ message: "Registration failed" });
        }

        res.status(201).json({ message: "User registered successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.length === 0) return res.status(404).json({ message: "User not found" });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
      },
    });
  });
};

exports.sendOtp = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const findUserSql = "SELECT * FROM users WHERE email = ?";
  db.query(findUserSql, [email], async (findErr, userResult) => {
    if (findErr) return res.status(500).json({ message: "Server error" });
    if (userResult.length === 0) return res.status(404).json({ message: "User not found with this email" });

    const sql = "INSERT INTO password_otps (email, otp, expires_at) VALUES (?, ?, ?)";
    db.query(sql, [email, otp, expiresAt], async (err) => {
      if (err) return res.status(500).json({ message: "Failed to send OTP" });

      try {
        await sendEmail({
          to: email,
          subject: "Globerra Password Reset OTP",
          text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
          html: `<h3>Globerra Password Reset</h3><p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
        });

        res.json({ message: "OTP sent successfully to your email" });
      } catch (emailErr) {
        console.error(emailErr);
        res.status(500).json({ message: "Failed to send OTP email" });
      }
    });
  });
};

exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const sql = `
    SELECT * FROM password_otps
    WHERE email = ? AND otp = ? AND expires_at > NOW()
    ORDER BY id DESC LIMIT 1
  `;

  db.query(sql, [email, otp], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.length === 0) return res.status(400).json({ message: "Invalid or expired OTP" });

    const updateSql = "UPDATE password_otps SET is_verified = 1 WHERE id = ?";
    db.query(updateSql, [result[0].id], () => {
      res.json({ message: "OTP verified successfully" });
    });
  });
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const checkSql = `
    SELECT * FROM password_otps
    WHERE email = ? AND is_verified = 1
    ORDER BY id DESC LIMIT 1
  `;

  db.query(checkSql, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.length === 0) return res.status(400).json({ message: "OTP not verified" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateUserSql = "UPDATE users SET password = ? WHERE email = ?";

    db.query(updateUserSql, [hashedPassword, email], (err2) => {
      if (err2) return res.status(500).json({ message: "Password reset failed" });
      res.json({ message: "Password reset successful" });
    });
  });
};