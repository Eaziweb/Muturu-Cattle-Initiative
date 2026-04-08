const express = require("express")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const User = require("../models/User")
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require("../utils/email")
const { generateMemberID } = require("../utils/memberID")
const { auth } = require("../middleware/auth")

const router = express.Router()

// ─── Register ─────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, ...otherData } = req.body
    const cleanEmail = email.toLowerCase().trim()

    let user = await User.findOne({ email: cleanEmail })

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message: "An account with this email is already verified. Please login.",
        })
      }

      // ── Unverified account: clear old code FIRST, save, then set new code ──
      // This prevents the old code from ever being valid again
      user.verificationCode = undefined
      await user.save()

      const newCode = Math.floor(100000 + Math.random() * 900000).toString().trim()
      user.fullName = fullName
      user.password = password
      user.verificationCode = newCode
      Object.assign(user, otherData)
      await user.save()

      await sendVerificationEmail(cleanEmail, newCode, user.memberID)

      return res.status(200).json({
        success: true,
        message: "Registration updated! A new verification code has been sent.",
        email: user.email,
        memberID: user.memberID,
      })
    }

    // ── New user ──────────────────────────────────────────────────────────────
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString().trim()
    const memberID = generateMemberID()

    user = new User({
      memberID,
      fullName,
      email: cleanEmail,
      password,
      verificationCode,
      ...otherData,
    })

    await user.save()
    await sendVerificationEmail(cleanEmail, verificationCode, memberID)

    res.status(201).json({
      success: true,
      message: "Registration successful! Please verify your email.",
      email: user.email,
      memberID,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ success: false, message: "Server error during registration" })
  }
})

// ─── Verify Email ─────────────────────────────────────────────────────────────
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required.",
      })
    }

    const cleanEmail = email.toLowerCase().trim()
    const cleanCode = code.toString().trim()

    // Find by email only
    const user = await User.findOne({ email: cleanEmail })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No account found with this email address.",
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "This account is already verified. Please login.",
      })
    }

    const storedCode = user.verificationCode
      ? user.verificationCode.toString().trim()
      : null

    if (!storedCode) {
      return res.status(400).json({
        success: false,
        message: "No active verification code. Please request a new one.",
      })
    }

    if (storedCode !== cleanCode) {
      return res.status(400).json({
        success: false,
        message: "Incorrect verification code. Please check and try again.",
      })
    }

    // ── Clear code and mark verified atomically ────────────────────────────────
    user.isVerified = true
    user.verificationCode = undefined
    await user.save()

    try {
      await sendWelcomeEmail(user.email, user.fullName, user.memberID)
    } catch (mailError) {
      console.error("Welcome email failed:", mailError)
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully!",
    })
  } catch (error) {
    console.error("Verification error:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

// ─── Resend Code ──────────────────────────────────────────────────────────────
router.post("/resend-code", async (req, res) => {
  try {
    const { email } = req.body
    const cleanEmail = email.toLowerCase().trim()

    const user = await User.findOne({ email: cleanEmail, isVerified: false })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No unverified account found with this email.",
      })
    }

    // ── Clear old code first, then set new one ────────────────────────────────
    user.verificationCode = undefined
    await user.save()

    const newCode = Math.floor(100000 + Math.random() * 900000).toString().trim()
    user.verificationCode = newCode
    await user.save()

    await sendVerificationEmail(cleanEmail, newCode, user.memberID)

    res.json({
      success: true,
      message: "A new verification code has been sent to your email.",
    })
  } catch (error) {
    console.error("Resend code error:", error)
    res.status(500).json({ success: false, message: "Error resending code" })
  }
})

// ─── Login ────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const cleanEmail = email.toLowerCase().trim()

    const user = await User.findOne({ email: cleanEmail })
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" })
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before logging in.",
      })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    res.json({
      success: true,
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
    res.status(500).json({ success: false, message: "Server error during login" })
  }
})

// ─── Forgot Password ──────────────────────────────────────────────────────────
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body
    const cleanEmail = email.toLowerCase().trim()

    const user = await User.findOne({ email: cleanEmail })
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email" })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = Date.now() + 3600000
    await user.save()

    await sendPasswordResetEmail(cleanEmail, resetToken)

    res.json({ success: true, message: "Password reset email sent" })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// ─── Reset Password ───────────────────────────────────────────────────────────
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" })
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({ success: true, message: "Password reset successful" })
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// ─── Get Current User ─────────────────────────────────────────────────────────
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

module.exports = router