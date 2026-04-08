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
      email,
      password,
      phoneNumber,
      country,
      state,
      profession,
      title,
      academicQualifications,
      researchDisciplines,
      googleScholarProfile,
      researchGateProfile,
    } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    // 2. Generate 6-digit numeric code and Member ID
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const memberID = generateMemberID();

    // 3. Create user (Ensure your User Schema has 'verificationCode' field)
    const user = new User({
      memberID,
      fullName,
      email,
      password,
      phoneNumber,
      country,
      state,
      profession,
      title,
      academicQualifications,
      researchDisciplines,
      googleScholarProfile,
      researchGateProfile,
      verificationCode, // Store the code instead of a token
      isVerified: false
    });

    await user.save();

    // 4. Send the numeric code via email
    await sendVerificationEmail(email, verificationCode, memberID);

    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email for the 6-digit verification code.",
      email, // Return email so frontend can redirect to verify page with it
      memberID,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
});

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify user email using the 6-digit code
 */
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: "Email and code are required" });
    }

    // Find user by email AND the numeric code
    const user = await User.findOne({ email, verificationCode: code });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired verification code" 
      });
    }

    // Update user status
    user.isVerified = true;
    user.verificationCode = undefined; // Remove code after successful use
    await user.save();

    // Send the professional welcome email with Member ID
    await sendWelcomeEmail(user.email, user.fullName, user.memberID);

    res.json({ 
      success: true, 
      message: "Email verified successfully! You can now log in." 
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ success: false, message: "Server error during email verification" });
  }
});


router.post("/resend-code", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, isVerified: false });

    if (!user) {
      return res.status(404).json({ success: false, message: "Unverified user not found" });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = newCode;
    await user.save();

    await sendVerificationEmail(email, newCode, user.memberID);

    res.json({ success: true, message: "A new verification code has been sent to your email." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error resending code" });
  }
});

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
