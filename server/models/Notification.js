// models/Notification.js
const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },
    image: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true
          return /^(https?:\/\/.*\.(jpg|jpeg|png|gif|webp))$/i.test(v)
        },
        message: "Invalid image URL format",
      },
    },
    type: {
      type: String,
      enum: ["announcement", "news", "event", "alert", "update", "reminder"],
      default: "announcement",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    sendToAll: {
      type: Boolean,
      default: true,
    },
    specificUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: function(v) {
          return !this.sendToAll || v.length === 0
        },
        message: "specificUsers should be empty when sendToAll is true",
      },
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    scheduledFor: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    readBy: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      readAt: {
        type: Date,
        default: Date.now,
      },
    }],
    stats: {
      totalSent: {
        type: Number,
        default: 0,
      },
      totalRead: {
        type: Number,
        default: 0,
      },
      uniqueReaders: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient querying
notificationSchema.index({ createdAt: -1 })
notificationSchema.index({ isActive: 1, expiresAt: 1 })
notificationSchema.index({ sendToAll: 1, specificUsers: 1 })
notificationSchema.index({ type: 1, priority: 1 })
notificationSchema.index({ "readBy.userId": 1 })

// Virtual for checking if notification is expired
notificationSchema.virtual("isExpired").get(function() {
  return this.expiresAt && this.expiresAt < new Date()
})

// Virtual for unread count
notificationSchema.virtual("unreadCount").get(function() {
  return this.stats.totalSent - this.stats.totalRead
})

// Method to mark notification as read by user
notificationSchema.methods.markAsRead = async function(userId) {
  const alreadyRead = this.readBy.some(read => read.userId.toString() === userId.toString())
  
  if (!alreadyRead) {
    this.readBy.push({ userId, readAt: new Date() })
    this.stats.totalRead += 1
    this.stats.uniqueReaders = this.readBy.length
    await this.save()
  }
  
  return this
}

// Method to check if user has read notification
notificationSchema.methods.isReadByUser = function(userId) {
  return this.readBy.some(read => read.userId.toString() === userId.toString())
}

// Static method to get unread notifications for user
notificationSchema.statics.getUnreadForUser = async function(userId, limit = 50) {
  return this.find({
    isActive: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gte: new Date() } }
    ],
    $or: [
      { sendToAll: true },
      { specificUsers: userId }
    ],
    "readBy.userId": { $ne: userId }
  })
  .sort({ priority: -1, createdAt: -1 })
  .limit(limit)
}

// Static method to get all notifications for user
notificationSchema.statics.getForUser = async function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit
  
  const query = {
    isActive: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gte: new Date() } }
    ],
    $or: [
      { sendToAll: true },
      { specificUsers: userId }
    ]
  }
  
  const [notifications, total] = await Promise.all([
    this.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email"),
    this.countDocuments(query)
  ])
  
  // Add read status to each notification
  const notificationsWithStatus = notifications.map(notification => {
    const notificationObj = notification.toObject()
    notificationObj.isRead = notification.isReadByUser(userId)
    return notificationObj
  })
  
  return {
    notifications: notificationsWithStatus,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNotifications: total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  }
}

// Pre-save middleware to validate specificUsers
notificationSchema.pre("save", function(next) {
  if (this.sendToAll && this.specificUsers && this.specificUsers.length > 0) {
    return next(new Error("Cannot specify specific users when sending to all"))
  }
  next()
})

// Ensure virtuals are included in JSON output
notificationSchema.set("toJSON", { virtuals: true })
notificationSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("Notification", notificationSchema)