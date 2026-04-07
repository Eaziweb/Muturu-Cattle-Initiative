const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["announcement", "news", "event", "alert", "update"],
      default: "announcement",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    targetAudience: {
      type: String,
      enum: ["all", "single", "group", "corporate", "active", "expired"],
      default: "all",
    },
    attachments: [
      {
        type: {
          type: String,
          enum: ["image", "pdf", "document"],
        },
        filename: String,
        url: String,
        size: Number,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    readBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    stats: {
      totalViews: {
        type: Number,
        default: 0,
      },
      uniqueViews: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying
notificationSchema.index({ publishDate: -1, isActive: 1 })
notificationSchema.index({ targetAudience: 1, isActive: 1 })
notificationSchema.index({ type: 1, priority: 1 })

module.exports = mongoose.model("Notification", notificationSchema)
