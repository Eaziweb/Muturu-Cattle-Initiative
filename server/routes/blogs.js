// Blog routes update
const express = require("express")
const router = express.Router()
const Blog = require("../models/Blog")
const { adminAuth } = require("../middleware/adminAuth")
const cloudinary = require("../config/cloudinary")
const upload = require("../middleware/blogUpload") // New middleware for blog uploads

// Get all published blogs (public)
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const tag = req.query.tag || ""

    const query = { published: true }

    if (search) {
      query.$text = { $search: search }
    }

    if (tag) {
      query.tags = { $in: [tag] }
    }

    const blogs = await Blog.find(query)
      .select("title excerpt image author createdAt tags views featured")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Blog.countDocuments(query)

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get recent blogs for homepage
router.get("/recent", async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 3

    const blogs = await Blog.find({ published: true })
      .select("title excerpt image author createdAt")
      .sort({ createdAt: -1 })
      .limit(limit)

    res.json(blogs)
  } catch (error) {
    console.error("Error fetching recent blogs:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single blog by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog || !blog.published) {
      return res.status(404).json({ message: "Blog not found" })
    }

    // Increment views
    blog.views += 1
    await blog.save()

    // Get recent blogs for sidebar (excluding current blog)
    const recentBlogs = await Blog.find({
      published: true,
      _id: { $ne: blog._id },
    })
      .select("title image createdAt")
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({ blog, recentBlogs })
  } catch (error) {
    console.error("Error fetching blog:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin routes (protected)
// Get all blogs for admin
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const search = req.query.search || ""

    const query = {}

    if (search) {
      query.$text = { $search: search }
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Blog.countDocuments(query)

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching admin blogs:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new blog (admin only)
router.post("/admin/create", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, content, tags, published, featured } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" })
    }

    let imageData = null
    if (req.file) {
      imageData = {
        url: req.file.path, // Cloudinary URL
        publicId: req.file.filename, // Cloudinary public ID
      }
    }

    const blog = new Blog({
      title,
      content,
      image: imageData,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      published: published !== undefined ? published : true,
      featured: featured || false,
      author: req.admin.username || "Admin",
      createdBy: req.admin._id
    })

    await blog.save()
    res.status(201).json({ message: "Blog created successfully", blog })
  } catch (error) {
    console.error("Error creating blog:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update blog (admin only)
router.put("/admin/:id", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, content, tags, published, featured } = req.body

    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (blog.image && blog.image.publicId) {
        try {
          await cloudinary.uploader.destroy(blog.image.publicId)
        } catch (err) {
          console.error("Error deleting old image from Cloudinary:", err)
        }
      }
      
      // Set new image data
      blog.image = {
        url: req.file.path,
        publicId: req.file.filename
      }
    }

    blog.title = title || blog.title
    blog.content = content || blog.content
    blog.tags = tags ? tags.split(',').map(tag => tag.trim()) : blog.tags
    blog.published = published !== undefined ? published : blog.published
    blog.featured = featured !== undefined ? featured : blog.featured
    blog.updatedBy = req.admin._id

    await blog.save()
    res.json({ message: "Blog updated successfully", blog })
  } catch (error) {
    console.error("Error updating blog:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete blog (admin only)
router.delete("/admin/:id", adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    // Delete image from Cloudinary if exists
    if (blog.image && blog.image.publicId) {
      try {
        await cloudinary.uploader.destroy(blog.image.publicId)
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err)
      }
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router