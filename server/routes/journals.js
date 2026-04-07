const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const Journal = require("../models/Journal")
const { adminAuth } = require("../middleware/adminAuth")
const { auth } = require("../middleware/auth")
const { upload } = require("../middleware/upload")

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/journals/"
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

// Get all journals (public)
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

    const journals = await Journal.find(query)
      .select("-filePath")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("createdBy", "fullName")
      .exec()

    const total = await Journal.countDocuments(query)

    res.json({
      journals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching journals:", error)
    res.status(500).json({ message: "Error fetching journals", error: error.message })
  }
})

// Get single journal (public)
router.get("/:id", async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, isActive: true })
      .select("-filePath")
      .populate("createdBy", "fullName")
      .exec()

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" })
    }

    res.json(journal)
  } catch (error) {
    console.error("Error fetching journal:", error)
    res.status(500).json({ message: "Error fetching journal", error: error.message })
  }
})

// Create journal (admin only)
router.post(
  "/admin",
  adminAuth,
  upload([
    { name: "file", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("Creating journal with data:", req.body)
      console.log("Files received:", req.files)

      const {
        title,
        issn,
        volume,
        issue,
        publishedDate,
        description,
        abstract,
        editors,
        publisher,
        category,
        price,
        currency,
        pages,
        keywords,
        language,
        indexedIn,
        impactFactor,
      } = req.body

      if (!req.files || !req.files.file) {
        return res.status(400).json({ message: "Journal file is required" })
      }

      const file = req.files.file[0]
      const coverImage = req.files.coverImage ? req.files.coverImage[0] : null

      // Parse arrays from JSON strings
      const parsedEditors = typeof editors === "string" ? JSON.parse(editors) : editors
      const parsedKeywords = typeof keywords === "string" ? JSON.parse(keywords) : keywords
      const parsedIndexedIn = typeof indexedIn === "string" ? JSON.parse(indexedIn) : indexedIn

      const journal = new Journal({
        title,
        issn: issn || `ISSN-${Date.now()}`,
        volume: volume || "1",
        issue: issue || "1",
        publishedDate,
        description: description || "",
        abstract: abstract || "",
        editors: Array.isArray(parsedEditors) ? parsedEditors.filter((e) => e && e.trim()) : [],
        publisher: publisher || "Unknown Publisher",
        category,
        price: Number.parseFloat(price),
        currency: currency || "NGN",
        filePath: file.path,
        fileName: file.originalname,
        fileSize: file.size,
        cloudinaryUrl: file.path, // Cloudinary URL
        cloudinaryPublicId: file.filename, // Cloudinary public ID
        coverImage: coverImage ? coverImage.path : "",
        coverImageCloudinaryId: coverImage ? coverImage.filename : "",
        pages: pages ? Number.parseInt(pages) : undefined,
        keywords: Array.isArray(parsedKeywords) ? parsedKeywords.filter((k) => k && k.trim()) : [],
        language: language || "English",
        indexedIn: Array.isArray(parsedIndexedIn) ? parsedIndexedIn.filter((i) => i && i.trim()) : [],
        impactFactor: impactFactor ? Number.parseFloat(impactFactor) : undefined,
        createdBy: req.user.id,
      })

      await journal.save()
      console.log("Journal created successfully:", journal._id)

      res.status(201).json({ message: "Journal created successfully", journal })
    } catch (error) {
      console.error("Error creating journal:", error)
      res.status(500).json({ message: "Error creating journal", error: error.message })
    }
  },
)

// Update journal (admin only)
router.put(
  "/admin/:id",
  adminAuth,
  upload([
    { name: "file", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const journal = await Journal.findById(req.params.id)
      if (!journal) {
        return res.status(404).json({ message: "Journal not found" })
      }

      const updateData = { ...req.body }

      // Parse JSON fields
      if (updateData.editors) updateData.editors = JSON.parse(updateData.editors).filter((e) => e && e.trim())
      if (updateData.keywords) updateData.keywords = JSON.parse(updateData.keywords).filter((k) => k && k.trim())
      if (updateData.indexedIn) updateData.indexedIn = JSON.parse(updateData.indexedIn).filter((i) => i && i.trim())
      if (updateData.price) updateData.price = Number.parseFloat(updateData.price)
      if (updateData.pages) updateData.pages = Number.parseInt(updateData.pages)
      if (updateData.impactFactor) updateData.impactFactor = Number.parseFloat(updateData.impactFactor)

      // Handle file updates with Cloudinary
      if (req.files && req.files.file) {
        const file = req.files.file[0]
        // Delete old file from Cloudinary if exists
        if (journal.cloudinaryPublicId) {
          const cloudinary = require("../config/cloudinary")
          await cloudinary.uploader.destroy(journal.cloudinaryPublicId, { resource_type: "raw" })
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
        if (journal.coverImageCloudinaryId) {
          const cloudinary = require("../config/cloudinary")
          await cloudinary.uploader.destroy(journal.coverImageCloudinaryId)
        }
        updateData.coverImage = coverImage.path
        updateData.coverImageCloudinaryId = coverImage.filename
      }

      const updatedJournal = await Journal.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      })

      res.json({ message: "Journal updated successfully", journal: updatedJournal })
    } catch (error) {
      console.error("Error updating journal:", error)
      res.status(500).json({ message: "Error updating journal", error: error.message })
    }
  },
)

// Delete journal (admin only)
router.delete("/admin/:id", adminAuth, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id)
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" })
    }

    // Delete files from Cloudinary
    const cloudinary = require("../config/cloudinary")
    if (journal.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(journal.cloudinaryPublicId, { resource_type: "raw" })
    }
    if (journal.coverImageCloudinaryId) {
      await cloudinary.uploader.destroy(journal.coverImageCloudinaryId)
    }

    await Journal.findByIdAndDelete(req.params.id)

    res.json({ message: "Journal deleted successfully" })
  } catch (error) {
    console.error("Error deleting journal:", error)
    res.status(500).json({ message: "Error deleting journal", error: error.message })
  }
})

// Get admin journals with stats
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

    const journals = await Journal.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("createdBy", "fullName")
      .exec()

    const total = await Journal.countDocuments(query)

    res.json({
      journals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching admin journals:", error)
    res.status(500).json({ message: "Error fetching journals", error: error.message })
  }
})

module.exports = router
