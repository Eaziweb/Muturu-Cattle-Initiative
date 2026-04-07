// routes/admin.js
const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")
const { adminAuth, superAdminAuth } = require("../middleware/adminAuth")

// Super Admin Login
router.post("/superadmin/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if superadmin exists
    const admin = await Admin.findOne({ email, role: "super_admin" })
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Update last login
    admin.lastLogin = new Date()
    await admin.save()

    // Create JWT
    const token = jwt.sign({ adminId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("Superadmin login error:", error)
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server error" })
    }
  }
})

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if admin exists
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Update last login
    admin.lastLogin = new Date()
    await admin.save()

    // Create JWT
    const token = jwt.sign({ adminId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("Admin login error:", error)
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server error" })
    }
  }
})

// Get current admin
router.get("/me", adminAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      admin: req.admin,
    })
  } catch (error) {
    console.error("Get admin error:", error)
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server error" })
    }
  }
})

// Create Admin (Super Admin only)
router.post("/create", superAdminAuth, async (req, res) => {
  try {
    const { username, email, password, role } = req.body

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" })
    }

    // Create new admin
    const newAdmin = new Admin({
      username,
      email,
      password,
      role: role || "admin",
    })

    await newAdmin.save()

    res.json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    })
  } catch (error) {
    console.error("Create admin error:", error)
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server error" })
    }
  }
})

// Get all admins (Super Admin only)
router.get("/list", superAdminAuth, async (req, res) => {
  try {
    const admins = await Admin.find().select("-password")
    res.json({ success: true, admins })
  } catch (error) {
    console.error("Get admins list error:", error)
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server error" })
    }
  }
})

// Delete admin (Super Admin only)
router.delete("/:id", superAdminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id)

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" })
    }

    // Prevent deletion of super admins
    if (admin.role === "super_admin") {
      return res.status(403).json({ success: false, message: "Cannot delete super admin" })
    }

    await Admin.deleteOne({ _id: req.params.id })

    res.json({ success: true, message: "Admin deleted successfully" })
  } catch (error) {
    console.error("Delete admin error:", error)
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server error" })
    }
  }
})

module.exports = router
