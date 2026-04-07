const express = require("express")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const Notification = require("../models/Notification")
const User = require("../models/User")
const router = express.Router()
const {adminAuth } = require("../middleware/adminAuth")
const { auth } = require("../middleware/auth")
// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf", "application/msword"]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Only images, PDFs, and documents are allowed"), false)
    }
  },
})

// // Middleware to verify user JWT token
// const auth = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1]

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "No token provided",
//     })
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     if (decoded.type !== "user") {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied",
//       })
//     }
//     req.userId = decoded.id
//     next()
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token",
//     })
//   }
// }

// // Middleware to verify admin JWT token
// const adminAuth = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1]

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "No token provided",
//     })
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     if (decoded.type !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied",
//       })
//     }
//     req.adminId = decoded.id
//     next()
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token",
//     })
//   }
// }

// Get notifications for members


// Mark notification as read
router.post("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    // Check if already read by this user
    const alreadyRead = notification.readBy.some((read) => read.userId.toString() === req.userId)

    if (!alreadyRead) {
      // Add to readBy array
      notification.readBy.push({
        userId: req.userId,
        readAt: new Date(),
      })

      // Update stats
      notification.stats.uniqueViews += 1
      await notification.save()
    }

    // Always increment total views
    notification.stats.totalViews += 1
    await notification.save()

    res.json({
      success: true,
      message: "Notification marked as read",
    })
  } catch (error) {
    console.error("Mark notification as read error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    })
  }
})

// Get single notification details
router.get("/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate("createdBy", "name")

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    // Check if user has read this notification
    const hasRead = notification.readBy.some((read) => read.userId.toString() === req.userId)

    res.json({
      success: true,
      data: {
        ...notification.toObject(),
        hasRead,
      },
    })
  } catch (error) {
    console.error("Get notification details error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch notification details",
    })
  }
})

// Admin: Create new notification
router.post("/admin", adminAuth, upload.array("attachments", 5), async (req, res) => {
  try {
    const { title, content, type, priority, targetAudience, expiryDate } = req.body

    // Upload attachments to Cloudinary
    const attachments = []
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const resourceType = file.mimetype.startsWith("image/") ? "image" : "raw"

          cloudinary.uploader
            .upload_stream(
              {
                resource_type: resourceType,
                folder: "mcrn/notifications",
                public_id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              },
              (error, result) => {
                if (error) reject(error)
                else resolve(result)
              },
            )
            .end(file.buffer)
        })

        attachments.push({
          type: file.mimetype.startsWith("image/") ? "image" : file.mimetype === "application/pdf" ? "pdf" : "document",
          filename: file.originalname,
          url: uploadResult.secure_url,
          size: file.size,
        })
      }
    }

    // Create notification
    const notification = new Notification({
      title,
      content,
      type: type || "announcement",
      priority: priority || "medium",
      targetAudience: targetAudience || "all",
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      attachments,
      createdBy: req.adminId,
    })

    await notification.save()

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    })
  } catch (error) {
    console.error("Create notification error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create notification",
    })
  }
})

// Admin: Get all notifications with stats
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.type) {
      filter.type = req.query.type
    }
    if (req.query.targetAudience) {
      filter.targetAudience = req.query.targetAudience
    }

    const notifications = await Notification.find(filter)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Notification.countDocuments(filter)

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: notifications.length,
          totalNotifications: total,
        },
      },
    })
  } catch (error) {
    console.error("Get admin notifications error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    })
  }
})

// Admin: Update notification
router.put("/admin/:id", adminAuth, async (req, res) => {
  try {
    const { title, content, type, priority, targetAudience, expiryDate, isActive } = req.body

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        type,
        priority,
        targetAudience,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        isActive,
      },
      { new: true },
    )

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    res.json({
      success: true,
      message: "Notification updated successfully",
      data: notification,
    })
  } catch (error) {
    console.error("Update notification error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update notification",
    })
  }
})

// Admin: Delete notification
router.delete("/admin/:id", adminAuth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    res.json({
      success: true,
      message: "Notification deleted successfully",
    })
  } catch (error) {
    console.error("Delete notification error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    })
  }
})

module.exports = router
    