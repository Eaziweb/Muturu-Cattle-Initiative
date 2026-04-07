const mongoose = require("mongoose")

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      enum: ["NGN", "USD", "EUR", "GBP"],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "flutterwave",
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    flutterwaveRef: {
      type: String,
      required: true,
    },
    downloadToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    downloadTokenExpiry: {
      type: Date,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    maxDownloads: {
      type: Number,
      default: 3,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
purchaseSchema.index({ user: 1, itemType: 1, itemId: 1 })
purchaseSchema.index({ transactionId: 1 })
purchaseSchema.index({ downloadToken: 1 })
purchaseSchema.index({ downloadTokenExpiry: 1 })

module.exports = mongoose.model("Purchase", purchaseSchema)
