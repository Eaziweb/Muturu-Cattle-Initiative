const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const Publication = require("../models/Publication")
const { adminAuth } = require("../middleware/adminAuth")
const { auth } = require("../middleware/auth")
const { upload } = require("../middleware/upload")

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/publications/"
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

// Get all publications (public)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, sortBy = "createdAt", sortOrder = "desc" } = req.query

    const query = { isActive: true }

    if (search) {
      query.$text = { $search: search }
    }

    if (category && category !== "all") {
      query.category = category
    }

    const sort = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    const publications = await Publication.find(query)
      .select("-filePath")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("createdBy", "fullName")
      .exec()

    const total = await Publication.countDocuments(query)

    res.json({
      publications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching publications:", error)
    res.status(500).json({ message: "Error fetching publications", error: error.message })
  }
})

// Get single publication (public)
router.get("/:id", async (req, res) => {
  try {
    const publication = await Publication.findOne({ _id: req.params.id, isActive: true })
      .select("-filePath")
      .populate("createdBy", "fullName")
      .exec()

    if (!publication) {
      return res.status(404).json({ message: "Publication not found" })
    }

    res.json(publication)
  } catch (error) {
    console.error("Error fetching publication:", error)
    res.status(500).json({ message: "Error fetching publication", error: error.message })
  }
})

// Create publication (admin only)
router.post(
  "/admin",
  adminAuth,
  upload([
    { name: "file", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("Creating publication with data:", req.body)
      console.log("Files received:", req.files)

      const {
        title,
        authors,
        abstract,
        keywords,
        category,
        publishedDate,
        pages,
        doi,
        isbn,
        publisher,
        journal,
        volume,
        issue,
        price,
        currency,
        description,
        tags,
        language,
      } = req.body

      if (!req.files || !req.files.file) {
        return res.status(400).json({ message: "Publication file is required" })
      }

      const file = req.files.file[0]
      const coverImage = req.files.coverImage ? req.files.coverImage[0] : null

      // Parse arrays from JSON strings
      const parsedAuthors = typeof authors === "string" ? JSON.parse(authors) : authors
      const parsedKeywords = typeof keywords === "string" ? JSON.parse(keywords) : keywords
      const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags

      const publication = new Publication({
        title,
        authors: Array.isArray(parsedAuthors) ? parsedAuthors.filter((a) => a && a.trim()) : [],
        abstract: abstract || "",
        keywords: Array.isArray(parsedKeywords) ? parsedKeywords.filter((k) => k && k.trim()) : [],
        category,
        publishedDate,
        pages: pages ? Number.parseInt(pages) : undefined,
        doi: doi || undefined,
        isbn: isbn || undefined,
        publisher: publisher || undefined,
        journal: journal || undefined,
        volume: volume || undefined,
        issue: issue || undefined,
        price: Number.parseFloat(price),
        currency: currency || "NGN",
        filePath: file.path,
        fileName: file.originalname,
        fileSize: file.size,
        cloudinaryUrl: file.path, // Cloudinary URL
        cloudinaryPublicId: file.filename, // Cloudinary public ID
        coverImage: coverImage ? coverImage.path : "",
        coverImageCloudinaryId: coverImage ? coverImage.filename : "",
        description: description || "",
        tags: Array.isArray(parsedTags) ? parsedTags.filter((t) => t && t.trim()) : [],
        language: language || "English",
        createdBy: req.user.id,
      })

      await publication.save()
      console.log("Publication created successfully:", publication._id)

      res.status(201).json({ message: "Publication created successfully", publication })
    } catch (error) {
      console.error("Error creating publication:", error)
      res.status(500).json({ message: "Error creating publication", error: error.message })
    }
  },
)

// Update publication (admin only)
router.put(
  "/admin/:id",
  adminAuth,
  upload([
    { name: "file", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const publication = await Publication.findById(req.params.id)
      if (!publication) {
        return res.status(404).json({ message: "Publication not found" })
      }

      const updateData = { ...req.body }

      // Parse JSON fields
      if (updateData.authors) updateData.authors = JSON.parse(updateData.authors).filter((a) => a && a.trim())
      if (updateData.keywords) updateData.keywords = JSON.parse(updateData.keywords).filter((k) => k && k.trim())
      if (updateData.tags) updateData.tags = JSON.parse(updateData.tags).filter((t) => t && t.trim())
      if (updateData.price) updateData.price = Number.parseFloat(updateData.price)
      if (updateData.pages) updateData.pages = Number.parseInt(updateData.pages)

      // Handle file updates with Cloudinary
      if (req.files && req.files.file) {
        const file = req.files.file[0]
        // Delete old file from Cloudinary if exists
        if (publication.cloudinaryPublicId) {
          const cloudinary = require("../config/cloudinary")
          await cloudinary.uploader.destroy(publication.cloudinaryPublicId, { resource_type: "raw" })
        }
        updateData.filePath = file.path
        updateData.fileName = file.originalname
        updateData.fileSize = file.size
        updateData.cloudinaryUrl = file.path
        updateData.cloudinaryPublicId = file.filename
      }

      if (req.files && req.files.coverImage) {
        const coverImage = req.files.coverImage[0]
        // Delete old cover from Cloudinary if exists
        if (publication.coverImageCloudinaryId) {
          const cloudinary = require("../config/cloudinary")
          await cloudinary.uploader.destroy(publication.coverImageCloudinaryId)
        }
        updateData.coverImage = coverImage.path
        updateData.coverImageCloudinaryId = coverImage.filename
      }

      const updatedPublication = await Publication.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      })

      res.json({ message: "Publication updated successfully", publication: updatedPublication })
    } catch (error) {
      console.error("Error updating publication:", error)
      res.status(500).json({ message: "Error updating publication", error: error.message })
    }
  },
)

// Delete publication (admin only)
router.delete("/admin/:id", adminAuth, async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id)
    if (!publication) {
      return res.status(404).json({ message: "Publication not found" })
    }

    // Delete files from Cloudinary
    const cloudinary = require("../config/cloudinary")
    if (publication.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(publication.cloudinaryPublicId, { resource_type: "raw" })
    }
    if (publication.coverImageCloudinaryId) {
      await cloudinary.uploader.destroy(publication.coverImageCloudinaryId)
    }

    await Publication.findByIdAndDelete(req.params.id)

    res.json({ message: "Publication deleted successfully" })
  } catch (error) {
    console.error("Error deleting publication:", error)
    res.status(500).json({ message: "Error deleting publication", error: error.message })
  }
})

// Get admin publications with stats
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query

    const query = {}

    if (search) {
      query.$text = { $search: search }
    }

    if (category && category !== "all") {
      query.category = category
    }

    const publications = await Publication.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("createdBy", "fullName")
      .exec()

    const total = await Publication.countDocuments(query)

    res.json({
      publications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching admin publications:", error)
    res.status(500).json({ message: "Error fetching publications", error: error.message })
  }
})

module.exports = router
  