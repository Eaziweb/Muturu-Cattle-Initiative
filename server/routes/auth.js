const express = require("express")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const User = require("../models/User")
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require("../utils/email")
const { generateMemberID } = require("../utils/memberID")
const { auth } = require("../middleware/auth")

const router = express.Router()

router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, ...otherData } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // IF USER IS ALREADY VERIFIED -> Block re-registration
      if (user.isVerified) {
        return res.status(400).json({ 
          success: false, 
          message: "An account with this email is already verified. Please login." 
        });
      }

      // IF USER EXISTS BUT IS NOT VERIFIED -> Allow "Overwriting" their registration
      // This helps if they made a typo in their name or want to reset their code
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      user.fullName = fullName;
      user.password = password; // The pre-save hook in your model will hash this
      user.verificationCode = newCode;
      // Update any other fields provided
      Object.assign(user, otherData);

      await user.save();

      // Send the NEW code
      await sendVerificationEmail(email, newCode, user.memberID);

      return res.status(200).json({
        success: true,
        message: "Registration updated! A new verification code has been sent.",
        email: user.email,
        memberID: user.memberID
      });
    }

    // 2. NORMAL FLOW: If user doesn't exist at all, create new
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const memberID = generateMemberID();

    user = new User({
      memberID,
      fullName,
      email,
      password,
      verificationCode,
      ...otherData
    });

    await user.save();
    await sendVerificationEmail(email, verificationCode, memberID);

    res.status(201).json({
      success: true,
      message: "Registration successful! Please verify your email.",
      email: user.email,
      memberID
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

    // 1. Validate inputs exist
    if (!email || !code) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and verification code are required." 
      });
    }

    // 2. Clean the data to prevent simple mismatch errors
    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.toString().trim();

    // 3. Find user with matching email and code
    const user = await User.findOne({ 
      email: cleanEmail, 
      verificationCode: cleanCode 
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired verification code. Please check your email and try again." 
      });
    }

    // 4. Update user
    user.isVerified = true;
    user.verificationCode = undefined; // Remove the code so it can't be used again
    await user.save();

    // 5. Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.fullName, user.memberID);
    } catch (mailError) {
      console.error("Welcome email failed to send:", mailError);
      // We don't return error here because the user is already verified
    }

    res.status(200).json({ 
      success: true, 
      message: "Email verified successfully!" 
    });

  } catch (error) {
    console.error("Verification Route Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
