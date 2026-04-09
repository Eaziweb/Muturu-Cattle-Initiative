const express = require("express")
const User = require("../models/User")
const {adminAuth } = require("../middleware/adminAuth")
const { auth } = require("../middleware/auth")
const profileUpload = require("../middleware/profileUpload")

const router = express.Router()

// Update user profile
// Update user profile
// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // List of allowed fields to update from the request body
    const allowedUpdates = [
      "fullName",
      "title",
      "profession",
      "academicQualifications",
      "researchDisciplines",
      "country",
      "state",
      "bio",
      "phoneNumber",
      "gender",
      "googleScholarProfile",
      "researchGateProfile",
      "profileImage"
    ];

    // Dynamically update only the fields provided in req.body
    // Using 'undefined' check allows users to send empty strings "" to clear a field
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    // Fetch fresh user data without password
    const updatedUser = await User.findById(req.user.id).select("-password");
    
    res.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ 
      message: "Server error during profile update",
      details: error.message 
    });
  }
});
 // Get single member full profile
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -notifications"); // Exclude sensitive info but include Bio/Academic info
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Upload profile image
router.post("/profile-image", auth, profileUpload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profileImage = req.file.path;
    await user.save();

    res.json({ profileImage: user.profileImage });
  } catch (error) {
    console.error("Profile image upload error:", error);
    res.status(500).json({ message: "Server error during image upload" });
  }
});

// Remove profile image
router.delete("/profile-image", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If you want to delete the image from Cloudinary, you would need to extract the public_id
    // For simplicity, we're just removing the reference
    user.profileImage = "";
    await user.save();

    res.json({ message: "Profile image removed" });
  } catch (error) {
    console.error("Profile image removal error:", error);
    res.status(500).json({ message: "Server error during image removal" });
  }
});

// Get all verified members (public info only)
router.get("/members", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", country = "", profession = "" } = req.query

    const query = { isVerified: true }

    if (search) {
      query.fullName = { $regex: search, $options: "i" }
    }

    if (country) {
      query.country = { $regex: country, $options: "i" }
    }

    if (profession) {
      query.profession = { $regex: profession, $options: "i" }
    }

    const users = await User.find(query)
      .select(
        "memberID fullName title academicQualifications researchDisciplines googleScholarProfile researchGateProfile country state profession createdAt profileImage",
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(query)

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get members error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin: Get all users with full details
router.get("/admin/members", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query

    const query = { isVerified: true }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { memberID: { $regex: search, $options: "i" } },
      ]
    }

    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(query)

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Admin get members error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin: Send notification to users
router.post("/admin/send-notification", adminAuth, async (req, res) => {
  try {
    const { userIds, title, message, image } = req.body

    const notification = {
      id: Date.now().toString(),
      title,
      message,
      image: image || "",
      isRead: false,
      createdAt: new Date(),
    }

    if (userIds && userIds.length > 0) {
      // Send to specific users
      await User.updateMany({ _id: { $in: userIds } }, { $push: { notifications: notification } })
    } else {
      // Send to all verified users
      await User.updateMany({ isVerified: true }, { $push: { notifications: notification } })
    }

    res.json({ message: "Notification sent successfully" })
  } catch (error) {
    console.error("Send notification error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user notifications
router.get("/notifications", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("notifications")
    res.json(user.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  } catch (error) {
    console.error("Get notifications error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Mark notification as read
router.put("/notifications/:notificationId/read", auth, async (req, res) => {
  try {
    const { notificationId } = req.params

    await User.updateOne(
      { _id: req.user.id, "notifications.id": notificationId },
      { $set: { "notifications.$.isRead": true } },
    )

    res.json({ message: "Notification marked as read" })
  } catch (error) {
    console.error("Mark notification read error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
