const mongoose = require("mongoose")

const donationSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    donorName: {
      type: String,
      required: true,
    },
    donorEmail: {
      type: String,
      required: true,
    },
    donorPhone: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "successful", "failed", "cancelled"],
      default: "pending",
    },
    flutterwaveRef: {
      type: String,
      sparse: true, // Allows multiple null values without unique constraint violation
    },
  },
  {
    timestamps: true,
  },
)

donationSchema.index({ flutterwaveRef: 1 }, { sparse: true })

module.exports = mongoose.model("Donation", donationSchema)
