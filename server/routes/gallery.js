// routes/gallery.js
const express = require("express");
const Gallery = require("../models/Gallery");
const { adminAuth } = require("../middleware/adminAuth");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/galleryUpload");

const router = express.Router();

// Get all published galleries (public)
router.get("/", async (req, res, next) => {
  try {
    const galleries = await Gallery.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username");
    res.json(galleries);
  } catch (error) {
    next(error);
  }
});

// Get single gallery (public)
router.get("/:id", async (req, res, next) => {
  try {
    const gallery = await Gallery.findOne({
      _id: req.params.id,
      isPublished: true,
    }).populate("createdBy", "username");

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    res.json(gallery);
  } catch (error) {
    next(error);
  }
});

// Admin routes - require authentication
// Get all galleries for admin
router.get("/admin/all", adminAuth, async (req, res, next) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 }).populate("createdBy", "username");
    res.json(galleries);
  } catch (error) {
    next(error);
  }
});

// Create new gallery
router.post("/admin", adminAuth, upload.array("images", 10), async (req, res, next) => {
  try {
    const { title, description, isPublished = true } = req.body;

    // Process uploaded images
    const images = req.files
      ? req.files.map((file) => ({
          url: file.path, // Cloudinary URL
          publicId: file.filename, // Cloudinary public ID
          caption: "",
          uploadedAt: new Date(),
        }))
      : [];

    const gallery = new Gallery({
      title,
      description,
      images,
      isPublished: isPublished === "true" || isPublished === true,
      createdBy: req.admin._id,
    });

    await gallery.save();

    const populatedGallery = await Gallery.findById(gallery._id).populate("createdBy", "username");

    res.status(201).json(populatedGallery);
  } catch (error) {
    next(error);
  }
});

// Update gallery
router.put("/admin/:id", adminAuth, async (req, res, next) => {
  try {
    const { title, description, isPublished } = req.body;

    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        isPublished: isPublished === "true" || isPublished === true,
      },
      { new: true, runValidators: true },
    ).populate("createdBy", "username");

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    res.json(gallery);
  } catch (error) {
    next(error);
  }
});

// Add images to existing gallery
router.post("/admin/:id/images", adminAuth, upload.array("images", 10), async (req, res, next) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    // Process new images
    const newImages = req.files
      ? req.files.map((file) => ({
          url: file.path, // Cloudinary URL
          publicId: file.filename, // Cloudinary public ID
          caption: "",
          uploadedAt: new Date(),
        }))
      : [];

    // Add new images to existing ones
    gallery.images.push(...newImages);
    await gallery.save();

    const populatedGallery = await Gallery.findById(gallery._id).populate("createdBy", "username");

    res.json(populatedGallery);
  } catch (error) {
    next(error);
  }
});

// Update image caption
router.put("/admin/:id/images/:imageIndex", adminAuth, async (req, res, next) => {
  try {
    const { caption } = req.body;
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    const imageIndex = Number.parseInt(req.params.imageIndex);
    if (imageIndex < 0 || imageIndex >= gallery.images.length) {
      return res.status(404).json({ error: "Image not found" });
    }

    gallery.images[imageIndex].caption = caption;
    await gallery.save();

    const populatedGallery = await Gallery.findById(gallery._id).populate("createdBy", "username");

    res.json(populatedGallery);
  } catch (error) {
    next(error);
  }
});

// Delete specific image from gallery
router.delete("/admin/:id/images/:imageIndex", adminAuth, async (req, res, next) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    const imageIndex = Number.parseInt(req.params.imageIndex);
    if (imageIndex < 0 || imageIndex >= gallery.images.length) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Get the image to delete
    const imageToDelete = gallery.images[imageIndex];
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(imageToDelete.publicId);
    
    // Remove image from array
    gallery.images.splice(imageIndex, 1);
    await gallery.save();

     const populatedGallery = await Gallery.findById(gallery._id).populate("createdBy", "username");

    res.json(populatedGallery);
  } catch (error) {
    next(error);
  }
});

// Delete entire gallery
router.delete("/admin/:id", adminAuth, async (req, res, next) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    // Delete all images from Cloudinary
    for (const image of gallery.images) {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (err) {
        console.error(`Error deleting image ${image.publicId} from Cloudinary:`, err);
        // Continue with other images even if one fails
      }
    }

    // Delete gallery from database
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({ message: "Gallery deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;