const mongoose = require("mongoose")

const announcementSchema = new mongoose.Schema(
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
      enum: ["general", "urgent", "event", "update"],
      default: "general",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    image: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
    targetAudience: {
      type: String,
      enum: ["all", "members", "visitors"],
      default: "all",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
announcementSchema.index({ active: 1, createdAt: -1 })
announcementSchema.index({ expiresAt: 1 })

module.exports = mongoose.model("Announcement", announcementSchema)
