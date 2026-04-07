const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const Announcement = require("../models/Announcement")
const { adminAuth } = require("../middleware/adminAuth")

// ==================================================
// Public routes
// ==================================================

// Get active announcements (for everyone)

// Get active announcements (for everyone)
router.get("/", async (req, res) => {
  try {
    const now = new Date()
    const announcements = await Announcement.find({
      active: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } },
      ],
    })
      .select("title content type priority image createdAt")
      .sort({ priority: -1, createdAt: -1 })
      .limit(10)

    res.json(announcements)
  } catch (error) {
    console.error("Error fetching announcements:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Dedicated public audience announcements (with pagination)
router.get("/public", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 12
    const type = req.query.type

    const now = new Date()
    const query = {
      active: true,
      targetAudience: "all",
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } },
      ],
    }

    if (type) {
      query.type = type
    }

    const announcements = await Announcement.find(query)
      .select("title content type priority image createdAt expiresAt views")
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    const total = await Announcement.countDocuments(query)

    res.json({
      announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching public announcements:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Track announcement view
router.post("/:id/view", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid announcement ID" })
    }

    const announcement = await Announcement.findById(req.params.id)

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" })
    }

    // Increment views
    announcement.views += 1
    await announcement.save()

    res.json({ success: true, views: announcement.views })
  } catch (error) {
    console.error("Error tracking announcement view:", error)
    res.status(500).json({ message: "Server error" })
  }
})


// Get single announcement by ID and increment views
router.get("/:id", async (req, res) => {
  try {
    // Validate ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid announcement ID" })
    }

    const announcement = await Announcement.findById(req.params.id)

    if (!announcement || !announcement.active) {
      return res.status(404).json({ message: "Announcement not found" })
    }

    // Check expiry
    if (announcement.expiresAt && announcement.expiresAt < new Date()) {
      return res.status(404).json({ message: "Announcement expired" })
    }

    // Increment views
    announcement.views += 1
    await announcement.save()

    res.json(announcement)
  } catch (error) {
    console.error("Error fetching announcement:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// ==================================================
// Admin routes
// ==================================================

// Get all announcements (admin only)
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10

    const announcements = await Announcement.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    const total = await Announcement.countDocuments({})

    res.json({
      announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching admin announcements:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create announcement (admin only)
router.post("/admin/create", adminAuth, async (req, res) => {
  try {
    const { title, content, type, priority, image, expiresAt, targetAudience } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" })
    }

    const announcement = new Announcement({
      title,
      content,
      type: type || "general",
      priority: priority || "medium",
      image: image || "",
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      targetAudience: targetAudience || "all",
      createdBy: req.admin._id // Track which admin created this
    })

    await announcement.save()
    res.status(201).json({ message: "Announcement created successfully", announcement })
  } catch (error) {
    console.error("Error creating announcement:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update announcement (admin only)
router.put("/admin/:id", adminAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid announcement ID" })
    }

    const { title, content, type, priority, image, active, expiresAt, targetAudience } = req.body

    const announcement = await Announcement.findById(req.params.id)
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" })
    }

    announcement.title = title ?? announcement.title
    announcement.content = content ?? announcement.content
    announcement.type = type ?? announcement.type
    announcement.priority = priority ?? announcement.priority
    announcement.image = image ?? announcement.image
    announcement.active = active ?? announcement.active
    announcement.expiresAt = expiresAt ? new Date(expiresAt) : announcement.expiresAt
    announcement.targetAudience = targetAudience ?? announcement.targetAudience
    announcement.updatedBy = req.admin._id // Track which admin updated this

    await announcement.save()
    res.json({ message: "Announcement updated successfully", announcement })
  } catch (error) {
    console.error("Error updating announcement:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete announcement (admin only)
router.delete("/admin/:id", adminAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid announcement ID" })
    }

    const announcement = await Announcement.findById(req.params.id)
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" })
    }

    await Announcement.findByIdAndDelete(req.params.id)
    res.json({ message: "Announcement deleted successfully" })
  } catch (error) {
    console.error("Error deleting announcement:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
