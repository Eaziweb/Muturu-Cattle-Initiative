const mongoose = require("mongoose")

const downloadLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },
    itemType: {
      type: String,
      required: true,
      enum: ["publication", "journal"],
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "itemModel",
    },
    itemModel: {
      type: String,
      required: true,
      enum: ["Publication", "Journal"],
    },
    downloadToken: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    downloadDate: {
      type: Date,
      default: Date.now,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    downloadDuration: {
      type: Number, // in milliseconds
    },
  },
  {
    timestamps: true,
  },
)

// Index for analytics and reporting
downloadLogSchema.index({ user: 1, downloadDate: -1 })
downloadLogSchema.index({ itemType: 1, itemId: 1, downloadDate: -1 })
downloadLogSchema.index({ downloadDate: -1 })

module.exports = mongoose.model("DownloadLog", downloadLogSchema)
