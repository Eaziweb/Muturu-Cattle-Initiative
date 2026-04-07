const express = require("express")
const router = express.Router()
const Contact = require("../models/Contact")
const Blog = require("../models/Blog")
const { adminAuth } = require("../middleware/adminAuth") 
const nodemailer = require("nodemailer")

// Create contact message (public)
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message,
    })

    await contact.save()
    res.status(201).json({ message: "Message sent successfully" })
  } catch (error) {
    console.error("Error creating contact:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all contact messages (admin only)
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const status = req.query.status || ""

    const query = {}
    if (status) {
      query.status = status
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Contact.countDocuments(query)

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching contacts:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update contact status (admin only)
router.put("/admin/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" })
    }

    contact.status = status
    await contact.save()

    res.json({ message: "Status updated successfully", contact })
  } catch (error) {
    console.error("Error updating contact status:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Reply to contact (admin only)
router.post("/admin/:id/reply", adminAuth, async (req, res) => {
  try {
    const { reply } = req.body
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" })
    }

    contact.adminReply = reply
    contact.status = "replied"
    contact.repliedAt = new Date()
    await contact.save()

    // Here you could send an email reply to the user
    // Implementation depends on your email service setup

    res.json({ message: "Reply sent successfully", contact })
  } catch (error) {
    console.error("Error sending reply:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router