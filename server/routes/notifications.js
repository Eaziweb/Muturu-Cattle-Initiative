// routes/notificationRoutes.js
const express = require("express")
const router = express.Router()
const Notification = require("../models/Notification")
const User = require("../models/User")
const { auth } = require("../middleware/auth")
const { adminAuth } = require("../middleware/adminAuth")

// ==================== USER ROUTES ====================

// Get all notifications for authenticated user
router.get("/notifications", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    
    const result = await Notification.getForUser(
      req.userId,
      parseInt(page),
      parseInt(limit)
    )
    
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    })
  }
})

// Get unread notifications count
router.get("/notifications/unread/count", auth, async (req, res) => {
  try {
    const unreadNotifications = await Notification.getUnreadForUser(req.userId)
    
    res.json({
      success: true,
      data: {
        unreadCount: unreadNotifications.length,
      },
    })
  } catch (error) {
    console.error("Get unread count error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
    })
  }
})

// Mark single notification as read
router.put("/notifications/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }
    
    // Check if user should have access to this notification
    const hasAccess = notification.sendToAll || 
      notification.specificUsers.some(id => id.toString() === req.userId)
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this notification",
      })
    }
    
    await notification.markAsRead(req.userId)
    
    res.json({
      success: true,
      message: "Notification marked as read",
      data: {
        isRead: true,
      },
    })
  } catch (error) {
    console.error("Mark as read error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    })
  }
})

// Mark all notifications as read
router.put("/notifications/read-all", auth, async (req, res) => {
  try {
    const unreadNotifications = await Notification.getUnreadForUser(req.userId)
    
    await Promise.all(
      unreadNotifications.map(notification => notification.markAsRead(req.userId))
    )
    
    res.json({
      success: true,
      message: "All notifications marked as read",
      data: {
        markedCount: unreadNotifications.length,
      },
    })
  } catch (error) {
    console.error("Mark all as read error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    })
  }
})

// Delete notification for user (hide from their view)
router.delete("/notifications/:id/hide", auth, async (req, res) => {
  try {
    // Instead of deleting, we could add a hiddenBy array
    // For now, just mark as read
    const notification = await Notification.findById(req.params.id)
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }
    
    await notification.markAsRead(req.userId)
    
    res.json({
      success: true,
      message: "Notification hidden",
    })
  } catch (error) {
    console.error("Hide notification error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to hide notification",
    })
  }
})

// ==================== ADMIN ROUTES ====================

// Send notification to members
router.post("/admin/send-notification", adminAuth, async (req, res) => {
  try {
    const {
      title,
      message,
      image,
      sendToAll = true,
      userIds = [],
      type = "announcement",
      priority = "medium",
      scheduledFor = null,
      expiresAt = null,
    } = req.body
    
    // Validation
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      })
    }
    
    let specificUsers = []
    
    if (!sendToAll && userIds && userIds.length > 0) {
      // Verify users exist and are active
      const users = await User.find({
        _id: { $in: userIds },
        isActive: true,
      }).select("_id email fullName")
      
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No active users found with the provided IDs",
        })
      }
      
      specificUsers = users.map(u => u._id)
    }
    
    // Create notification
    const notification = new Notification({
      title,
      message,
      image: image || null,
      sendToAll: sendToAll && specificUsers.length === 0,
      specificUsers,
      type,
      priority,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: req.adminId,
      stats: {
        totalSent: sendToAll ? await User.countDocuments({ isActive: true }) : specificUsers.length,
        totalRead: 0,
        uniqueReaders: 0,
      },
    })
    
    await notification.save()
    
    // TODO: Implement real-time notifications via WebSocket/SSE here
    
    res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: {
        notification: {
          id: notification._id,
          title: notification.title,
          message: notification.message,
          sendToAll: notification.sendToAll,
          recipientCount: notification.stats.totalSent,
        },
      },
    })
  } catch (error) {
    console.error("Send notification error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message,
    })
  }
})

// Get all notifications (admin)
router.get("/admin/notifications", adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      priority,
      sendToAll,
      isActive,
      startDate,
      endDate,
    } = req.query
    
    const query = {}
    
    if (type) query.type = type
    if (priority) query.priority = priority
    if (sendToAll !== undefined) query.sendToAll = sendToAll === "true"
    if (isActive !== undefined) query.isActive = isActive === "true"
    
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("createdBy", "name email")
        .populate("specificUsers", "fullName email"),
      Notification.countDocuments(query),
    ])
    
    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalNotifications: total,
          hasNext: skip + notifications.length < total,
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

// Get notification statistics (admin)
router.get("/admin/notifications/stats", adminAuth, async (req, res) => {
  try {
    const [
      totalSent,
      totalRead,
      averageReadRate,
      notificationsByType,
      notificationsByPriority,
    ] = await Promise.all([
      Notification.aggregate([
        { $group: { _id: null, total: { $sum: "$stats.totalSent" } } },
      ]),
      Notification.aggregate([
        { $group: { _id: null, total: { $sum: "$stats.totalRead" } } },
      ]),
      Notification.aggregate([
        {
          $group: {
            _id: null,
            avgReadRate: {
              $avg: {
                $cond: [
                  { $eq: ["$stats.totalSent", 0] },
                  0,
                  {
                    $multiply: [
                      { $divide: ["$stats.totalRead", "$stats.totalSent"] },
                      100,
                    ],
                  },
                ],
              },
            },
          },
        },
      ]),
      Notification.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]),
      Notification.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),
    ])
    
    res.json({
      success: true,
      data: {
        totalSent: totalSent[0]?.total || 0,
        totalRead: totalRead[0]?.total || 0,
        averageReadRate: Math.round(averageReadRate[0]?.avgReadRate || 0),
        notificationsByType: notificationsByType.reduce((acc, curr) => {
          acc[curr._id] = curr.count
          return acc
        }, {}),
        notificationsByPriority: notificationsByPriority.reduce((acc, curr) => {
          acc[curr._id] = curr.count
          return acc
        }, {}),
      },
    })
  } catch (error) {
    console.error("Get notification stats error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    })
  }
})

// Update notification (admin)
router.put("/admin/notifications/:id", adminAuth, async (req, res) => {
  try {
    const {
      title,
      message,
      image,
      type,
      priority,
      sendToAll,
      specificUsers,
      isActive,
      expiresAt,
    } = req.body
    
    const notification = await Notification.findById(req.params.id)
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }
    
    // Update fields
    if (title) notification.title = title
    if (message) notification.message = message
    if (image !== undefined) notification.image = image
    if (type) notification.type = type
    if (priority) notification.priority = priority
    if (sendToAll !== undefined) notification.sendToAll = sendToAll
    if (specificUsers) notification.specificUsers = specificUsers
    if (isActive !== undefined) notification.isActive = isActive
    if (expiresAt) notification.expiresAt = new Date(expiresAt)
    
    await notification.save()
    
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

// Delete notification (admin)
router.delete("/admin/notifications/:id", adminAuth, async (req, res) => {
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

// Bulk delete notifications (admin)
router.delete("/admin/notifications/bulk", adminAuth, async (req, res) => {
  try {
    const { notificationIds } = req.body
    
    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No notification IDs provided",
      })
    }
    
    const result = await Notification.deleteMany({
      _id: { $in: notificationIds },
    })
    
    res.json({
      success: true,
      message: `${result.deletedCount} notifications deleted successfully`,
      data: {
        deletedCount: result.deletedCount,
      },
    })
  } catch (error) {
    console.error("Bulk delete error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete notifications",
    })
  }
})

module.exports = router