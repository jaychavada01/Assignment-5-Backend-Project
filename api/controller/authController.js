const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/mailer");

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { firstName, lastName, email, password } = req.body;

    // checks user already exists or not?
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(200).json({ message: "User already registered!" });

    // creating new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      coins: 100,
    });

    const token = generateToken(user);
    res.cookie("token", token);

    // Send Welcome Email
    const subject = "🎉 Welcome to Our Platform!";
    const htmlContent = `
      <h1>Hey ${firstName}, Welcome! 🎉</h1>
      <p>We're thrilled to have you join us.</p>
      <p>Your account has been successfully created.</p>
      <p>Start exploring now by <a href="${process.env.FRONTEND_URL}/login">logging in</a>.</p>
      <p>Enjoy your journey with us!</p>
      <br>
      <p>Best Regards,</p>
      <p><b>Support Team</b></p>
    `;

    await sendEmail(email, subject, htmlContent);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, coins: user.coins },
      token,
    });
  } catch (error) {
    console.error("Error while signing up!");
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    // Check if user has never received login coins before
    if (user.coins === 0) {
      user.coins += 100; // Reward 100 free coins
      await user.save();
    }

    const token = generateToken(user);

    res.cookie("token", token);

    res.json({ message: "Login successful", token, coins: user.coins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const forgetPasswordToken = uuidv4();
    const forgetPasswordTokenExpiry = Date.now() + 600000;

    await user.update({ forgetPasswordToken, forgetPasswordTokenExpiry });

    // Send Forget Password Email
    const subject = "Password Reset Request";
    const htmlContent = `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <p>In Future implementation Reset link will be added here!</p>
      <p>This link will expire in 10 minutes.</p>
    `;

    await sendEmail(email, subject, htmlContent);

    res.status(201).json({
      message: "Email has been sent successfully to rest password!",
      forgetPasswordToken,
      forgetPasswordTokenExpiry,
    });
  } catch (error) {
    console.log("error in sending mail:", error);
    res.status(500).json({ message: "server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    // comparing entered old password
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(401).json({ message: "Incorrect old password!" });
    }

    // replacing old password with new encrypted password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed!" });
  } catch (error) {
    res.status(500).json({ message: "Error in changing password!" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  generateToken,
  signUp,
  login,
  logout,
  forgetPassword,
  changePassword,
  resetPassword
};
