const mongoose = require("mongoose")

const PartnershipSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, "Contact person is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    organizationType: {
      type: String,
      required: [true, "Organization type is required"],
      enum: [
        "Research Institution",
        "University",
        "Government Agency",
        "NGO/Non-Profit",
        "Private Company",
        "International Organization",
        "Other",
      ],
    },
    partnershipType: {
      type: String,
      required: [true, "Partnership type is required"],
      enum: [
        "Research Collaboration",
        "Funding Partnership",
        "Technical Support",
        "Knowledge Exchange",
        "Joint Projects",
        "Capacity Building",
        "Other",
      ],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "approved", "rejected"],
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Partnership", PartnershipSchema)