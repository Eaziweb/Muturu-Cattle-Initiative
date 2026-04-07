// routes/events.js
const express = require("express");
const Event = require("../models/Event");
const { adminAuth } = require("../middleware/adminAuth");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/eventUpload");

const router = express.Router();

// Get all events (public)
router.get("/", async (req, res, next) => {
  try {
    const events = await Event.find({ status: "published" }).sort({ date: 1 }).populate("createdBy", "username");
    res.json(events);
  } catch (error) {
    next(error);
  }
});

// Get single event (public)
router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      status: "published",
    }).populate("createdBy", "username");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
});

// Admin routes - require authentication
// Get all events for admin
router.get("/admin/all", adminAuth, async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).populate("createdBy", "username");
    res.json(events);
  } catch (error) {
    next(error);
  }
});

// Create new event
router.post("/admin", adminAuth, upload.single("flyer"), async (req, res, next) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.admin._id,
    }

    // Parse objectives if it's a string
    if (typeof eventData.objectives === "string") {
      try {
        eventData.objectives = JSON.parse(eventData.objectives);
      } catch (e) {
        eventData.objectives = [eventData.objectives];
      }
    }

    // Parse account details if it's a string
    if (typeof eventData.accountDetails === "string") {
      try {
        eventData.accountDetails = JSON.parse(eventData.accountDetails);
      } catch (e) {
        eventData.accountDetails = {};
      }
    }

    // Add flyer URL and publicId if file was uploaded
    if (req.file) {
      eventData.flyer = {
        url: req.file.path, // Cloudinary URL
        publicId: req.file.filename, // Cloudinary public ID
      };
    }

    const event = new Event(eventData);
    await event.save();

    const populatedEvent = await Event.findById(event._id).populate("createdBy", "username");

    res.status(201).json(populatedEvent);
  } catch (error) {
    next(error);
  }
});

// Update event
// Update event
router.put("/admin/:id", adminAuth, upload.single("flyer"), async (req, res, next) => {
  try {
    const eventData = { ...req.body };

    // Parse objectives if it's a string
    if (typeof eventData.objectives === "string") {
      try {
        eventData.objectives = JSON.parse(eventData.objectives);
      } catch (e) {
        eventData.objectives = [eventData.objectives];
      }
    }

    // Parse account details if it's a string
    if (typeof eventData.accountDetails === "string") {
      try {
        eventData.accountDetails = JSON.parse(eventData.accountDetails);
      } catch (e) {
        eventData.accountDetails = {};
      }
    }

    // Get the existing event to check for existing flyer
    const existingEvent = await Event.findById(req.params.id);
    
    // Add flyer URL and publicId if new file was uploaded
    if (req.file) {

 if (existingEvent.flyer && existingEvent.flyer.publicId) {
      try {
        await cloudinary.uploader.destroy(existingEvent.flyer.publicId);
      } catch (err) {
        console.error(`Error deleting old flyer from Cloudinary:`, err);
        // Continue with update even if deletion fails
      }
    }
    
    // Add new flyer information
    eventData.flyer = {
      url: req.file.path, // Cloudinary URL
      publicId: req.file.filename, // Cloudinary public ID
    };
  }

  const event = await Event.findByIdAndUpdate(
    req.params.id, 
    eventData, 
    { new: true, runValidators: true }
  ).populate("createdBy", "username");

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  res.json(event);
} catch (error) {
  next(error);
}
});

// Delete event
router.delete("/admin/:id", adminAuth, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Delete flyer from Cloudinary if exists
    if (event.flyer && event.flyer.publicId) {
      try {
        await cloudinary.uploader.destroy(event.flyer.publicId);
      } catch (err) {
        console.error(`Error deleting flyer from Cloudinary:`, err);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }

    // Delete event from database
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;