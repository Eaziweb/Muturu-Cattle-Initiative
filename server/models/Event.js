// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  theme: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  objectives: [
    {
      type: String,
      trim: true,
    },
  ],
  flyer: {
    url: {
      type: String,
      default: null,
    },
    publicId: {
      type: String,
      default: null,
    },
  },
  registrationFee: {
    type: String,
    default: "Free",
  },
  callForAbstracts: {
    type: Boolean,
    default: false,
  },
  abstractDeadline: {
    type: Date,
    default: null,
  },
  accountDetails: {
    bankName: {
      type: String,
      default: "",
    },
    accountNumber: {
      type: String,
      default: "",
    },
    accountName: {
      type: String,
      default: "",
    },
  },
  status: {
    type: String,
    enum: ["draft", "published", "cancelled"],
    default: "published",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
eventSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Event", eventSchema);