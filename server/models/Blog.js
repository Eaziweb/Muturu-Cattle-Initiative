// Blog model update
const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      default: "Admin",
    },
    image: {
      type: mongoose.Schema.Types.Mixed, // Changed to Mixed to support both string and object
      default: "",
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    published: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Create excerpt from content if not provided
blogSchema.pre("save", function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200) + "..."
  }
  next()
})

// Index for search functionality
blogSchema.index({ title: "text", content: "text", tags: "text" })

module.exports = mongoose.model("Blog", blogSchema)