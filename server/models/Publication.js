const mongoose = require("mongoose")

const publicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    authors: [
      {
        type: String,
        required: true,
      },
    ],
    abstract: {
      type: String,
      required: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ["Research Paper", "Conference Paper", "Book Chapter", "Thesis", "Report", "Other"],
    },
    publishedDate: {
      type: Date,
      required: true,
    },
    pages: {
      type: Number,
      min: 1,
    },
    doi: {
      type: String,
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    journal: {
      type: String,
      trim: true,
    },
    volume: {
      type: String,
      trim: true,
    },
    issue: {
      type: String,
      trim: true,
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
    description: {
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
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    language: {
      type: String,
      default: "English",
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
publicationSchema.index({
  title: "text",
  abstract: "text",
  keywords: "text",
  authors: "text",
})

module.exports = mongoose.model("Publication", publicationSchema)
