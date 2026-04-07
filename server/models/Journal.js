const mongoose = require("mongoose")

const journalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    issn: {
      type: String,
      required: true,
      trim: true,
    },
    volume: {
      type: String,
      required: true,
      trim: true,
    },
    issue: {
      type: String,
      required: true,
      trim: true,
    },
    publishedDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    abstract: {
      type: String,
      default: "",
    },
    editors: [
      {
        type: String,
        trim: true,
      },
    ],
    publisher: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Science", "Technology", "Medicine", "Engineering", "Social Sciences", "Arts", "Other"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "NGN",
      enum: ["NGN", "USD", "EUR", "GBP"],
    },
    filePath: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      default: "",
    },
    cloudinaryPublicId: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    coverImageCloudinaryId: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },
    pages: {
      type: Number,
      min: 1,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    language: {
      type: String,
      default: "English",
    },
    indexedIn: [
      {
        type: String,
        trim: true,
      },
    ],
    impactFactor: {
      type: Number,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for search functionality
journalSchema.index({
  title: "text",
  description: "text",
  abstract: "text",
  keywords: "text",
})

module.exports = mongoose.model("Journal", journalSchema)
