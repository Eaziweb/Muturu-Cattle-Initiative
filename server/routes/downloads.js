// In routes/downloads.js
const express = require("express")
const axios = require("axios")
const Purchase = require("../models/Purchase")
const Publication = require("../models/Publication")
const Journal = require("../models/Journal")
const cloudinary = require("../config/cloudinary")

const router = express.Router()

// Verify download token
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params
    console.log("Verifying download token:", token)

    if (!token) {
      console.log("No token provided")
      return res.status(400).json({
        valid: false,
        message: "No download token provided",
      })
    }

    // Find purchase with the download token
    const purchase = await Purchase.findOne({ downloadToken: token }).populate("itemId")

    if (!purchase) {
      console.log("Purchase not found for token:", token)
      return res.status(404).json({
        valid: false,
        message: "Invalid download token",
      })
    }

    // Check if token has expired
    if (new Date() > purchase.downloadTokenExpiry) {
      console.log("Token expired for purchase:", purchase._id)
      return res.status(410).json({
        valid: false,
        message: "Download link has expired",
      })
    }

    // Check if download limit reached
    if (purchase.downloadCount >= purchase.maxDownloads) {
      console.log("Download limit reached for purchase:", purchase._id)
      return res.status(403).json({
        valid: false,
        message: "Download limit reached",
      })
    }

    // Get item details
    let item
    if (purchase.itemType === "publication") {
      item = await Publication.findById(purchase.itemId)
    } else {
      item = await Journal.findById(purchase.itemId)
    }

    if (!item) {
      console.log("Item not found for purchase:", purchase._id)
      return res.status(404).json({
        valid: false,
        message: "Item not found",
      })
    }

    console.log("Download token verified successfully for purchase:", purchase._id)
    
    res.json({
      valid: true,
      downloadInfo: {
        itemTitle: item.title,
        itemType: purchase.itemType,
        authors: item.authors || [],
        fileSize: item.fileSize ? `${(item.fileSize / (1024 * 1024)).toFixed(2)} MB` : "N/A",
        downloadsRemaining: purchase.maxDownloads - purchase.downloadCount,
        maxDownloads: purchase.maxDownloads,
        expiresAt: purchase.downloadTokenExpiry,
      },
    })
  } catch (error) {
    console.error("Error verifying download token:", error)
    res.status(500).json({ 
      valid: false,
      message: "Error verifying download token" 
    })
  }
})

// Download file
router.get("/file/:token", async (req, res) => {
  try {
    const { token } = req.params
    console.log("Downloading file for token:", token)

    if (!token) {
      console.log("No token provided")
      return res.status(400).json({ message: "No download token provided" })
    }

    const purchase = await Purchase.findOne({ downloadToken: token })

    if (!purchase) {
      console.log("Purchase not found for token:", token)
      return res.status(404).json({ message: "Invalid download token" })
    }

    // Check if token has expired
    if (new Date() > purchase.downloadTokenExpiry) {
      console.log("Token expired for purchase:", purchase._id)
      return res.status(403).json({ message: "Download link has expired" })
    }

    // Check if download limit reached
    if (purchase.downloadCount >= purchase.maxDownloads) {
      console.log("Download limit reached for purchase:", purchase._id)
      return res.status(403).json({ message: "Download limit reached" })
    }

    // Get item details
    let item
    if (purchase.itemType === "publication") {
      item = await Publication.findById(purchase.itemId)
    } else {
      item = await Journal.findById(purchase.itemId)
    }

    if (!item) {
      console.log("Item not found for purchase:", purchase._id)
      return res.status(404).json({ message: "Item not found" })
    }

    // Check if cloudinary URL exists
    if (!item.cloudinaryUrl) {
      console.log("Cloudinary URL not found for item:", item._id)
      return res.status(404).json({ message: "File not available" })
    }

    // Increment download count
    purchase.downloadCount += 1
    await purchase.save()
    console.log("Download count incremented for purchase:", purchase._id)

    // Update item download count
    if (purchase.itemType === "publication") {
      await Publication.findByIdAndUpdate(purchase.itemId, {
        $inc: { downloadCount: 1 },
      })
    } else {
      await Journal.findByIdAndUpdate(purchase.itemId, {
        $inc: { downloadCount: 1 },
      })
    }

    // Stream file from Cloudinary
    const response = await axios({
      method: "GET",
      url: item.cloudinaryUrl,
      responseType: "stream",
    })

    // Set headers for file download
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="${item.fileName || item.title + ".pdf"}"`)

    // Pipe the stream to response
    response.data.pipe(res)
  } catch (error) { 
    console.error("Error downloading file:", error)
    res.status(500).json({ message: "Error downloading file" })
  }
})

module.exports = router