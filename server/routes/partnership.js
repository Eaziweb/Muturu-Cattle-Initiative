const express = require("express")
const router = express.Router()
const Partnership = require("../models/Partnership")
const { adminAuth } = require("../middleware/adminAuth")
const nodemailer = require("nodemailer")

// Create partnership application (public)
router.post("/", async (req, res) => {
  try {
    const {
      organizationName,
      contactPerson,
      email,
      phone,
      organizationType,
      partnershipType,
      description,
      website,
    } = req.body

    // Validate required fields
    if (
      !organizationName ||
      !contactPerson ||
      !email ||
      !phone ||
      !organizationType ||
      !partnershipType ||
      !description
    ) {
      return res.status(400).json({ message: "All required fields must be filled" })
    }

    const partnership = new Partnership({
      organizationName,
      contactPerson,
      email,
      phone,
      organizationType,
      partnershipType,
      description,
      website: website || "",
    })

    await partnership.save()

    // Send notification email to admin
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: "New Partnership Application Received",
        html: `
          <h2>New Partnership Application</h2>
          <p><strong>Organization:</strong> ${organizationName}</p>
          <p><strong>Contact Person:</strong> ${contactPerson}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Organization Type:</strong> ${organizationType}</p>
          <p><strong>Partnership Type:</strong> ${partnershipType}</p>
          <p><strong>Description:</strong> ${description}</p>
          ${website ? `<p><strong>Website:</strong> <a href="${website}">${website}</a></p>` : ""}
          <p>Please review this application in the admin panel.</p>
        `,
      }

      await transporter.sendMail(mailOptions)
    } catch (emailError) {
      console.error("Error sending notification email:", emailError)
      // Continue even if email fails
    }

    res.status(201).json({ message: "Partnership application submitted successfully" })
  } catch (error) {
    console.error("Error creating partnership application:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all partnership applications (admin only)
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const status = req.query.status || ""

    const query = {}
    if (status) {
      query.status = status
    }

    const partnerships = await Partnership.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Partnership.countDocuments(query)

    res.json({
      partnerships,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching partnership applications:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single partnership application (admin only)
router.get("/admin/:id", adminAuth, async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id)
    
    if (!partnership) {
      return res.status(404).json({ message: "Partnership application not found" })
    }

    res.json(partnership)
  } catch (error) {
    console.error("Error fetching partnership application:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update partnership application status (admin only)
router.put("/admin/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body
    
    if (!["pending", "reviewed", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const partnership = await Partnership.findById(req.params.id)
    
    if (!partnership) {
      return res.status(404).json({ message: "Partnership application not found" })
    }

    partnership.status = status
    await partnership.save()

    // Send notification email to applicant
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })

      const statusMessages = {
        pending: "is currently under review",
        reviewed: "has been reviewed and is being considered",
        approved: "has been approved",
        rejected: "has been rejected",
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: partnership.email,
        subject: `Update on Your Partnership Application with ${process.env.ORGANIZATION_NAME}`,
        html: `
          <h2>Partnership Application Update</h2>
          <p>Dear ${partnership.contactPerson},</p>
          <p>Your partnership application from ${partnership.organizationName} ${statusMessages[status]}.</p>
          <p>We will contact you soon with further information.</p>
          <p>Thank you for your interest in partnering with us.</p>
          <p>Best regards,<br>${process.env.ORGANIZATION_NAME} Team</p>
        `,
      }

      await transporter.sendMail(mailOptions)
    } catch (emailError) {
      console.error("Error sending notification email:", emailError)
      // Continue even if email fails
    }

    res.json({ message: "Partnership status updated successfully", partnership })
  } catch (error) {
    console.error("Error updating partnership status:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add notes to partnership application (admin only)
router.put("/admin/:id/notes", adminAuth, async (req, res) => {
  try {
    const { notes } = req.body
    
    const partnership = await Partnership.findById(req.params.id)
    
    if (!partnership) {
      return res.status(404).json({ message: "Partnership application not found" })
    }

    partnership.notes = notes
    await partnership.save()

    res.json({ message: "Notes added successfully", partnership })
  } catch (error) {
    console.error("Error adding notes to partnership application:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete partnership application (admin only)
router.delete("/admin/:id", adminAuth, async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id)
    
    if (!partnership) {
      return res.status(404).json({ message: "Partnership application not found" })
    }

    await Partnership.findByIdAndDelete(req.params.id)

    res.json({ message: "Partnership application deleted successfully" })
  } catch (error) {
    console.error("Error deleting partnership application:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router