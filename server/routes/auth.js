const express = require("express")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const User = require("../models/User")
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require("../utils/email")
const { generateMemberID } = require("../utils/memberID")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      title,
      academicQualifications,
      researchDisciplines,
      googleScholarProfile,
      researchGateProfile,
      email,
      phoneNumber,
      country,
      state,
      profession,
      password,
    } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Generate member ID and verification token
    const memberID = generateMemberID()
    const verificationToken = crypto.randomBytes(32).toString("hex")

    // Create user
    const user = new User({
      memberID,
      fullName,
      title,
      academicQualifications,
      researchDisciplines,
      googleScholarProfile,
      researchGateProfile,
      email,
      phoneNumber,
      country,
      state,
      profession,
      password,
      verificationToken,
    })

    await user.save()

    // Send verification email
    await sendVerificationEmail(email, verificationToken, memberID)

    res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      memberID,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// Verify email
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params

    const user = await User.findOne({ verificationToken: token })
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" })
    }

    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    // Send welcome email
    await sendWelcomeEmail(user.email, user.fullName, user.memberID)

    res.json({ message: "Email verified successfully! Welcome email sent." })
  } catch (error) {
    console.error("Email verification error:", error)
    res.status(500).json({ message: "Server error during email verification" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email before logging in" })
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      token,
      user: {
        id: user._id,
        memberID: user.memberID,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
    await user.save()

    // Send reset email
    await sendPasswordResetEmail(email, resetToken)

    res.json({ message: "Password reset email sent" })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({ message: "Server error during password reset request" })
  }
})

// Reset password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" })
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({ message: "Password reset successful" })
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({ message: "Server error during password reset" })
  }
})

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
