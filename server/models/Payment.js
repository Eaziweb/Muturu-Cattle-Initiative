const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
  {
    memberID: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    paymentType: {
      type: String,
      enum: ["membership", "donation", "renewal"],
      required: true,
    },
    membershipType: {
      type: String,
      enum: ["single", "group", "corporate"],
    },
    flutterwaveReference: {
      type: String,
      unique: true,
    },
    transactionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "successful", "failed", "cancelled"],
      default: "pending",
    },
    paymentMethod: String,
    customerName: String,
    customerPhone: String,
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Payment", paymentSchema)
