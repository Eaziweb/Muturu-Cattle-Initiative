const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path") // Add this line
require("dotenv").config()

const Admin = require("./models/Admin")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const donationRoutes = require("./routes/donations")
const blogRoutes = require("./routes/blogs")
const contactRoutes = require("./routes/contact")
const announcementRoutes = require("./routes/announcements")
const adminRoutes = require("./routes/admin")
const eventRoutes = require("./routes/events")
const galleryRoutes = require("./routes/gallery")
const publicationRoutes = require("./routes/publications")
const journalRoutes = require("./routes/journals")
const paymentRoutes = require("./routes/payments")
const downloadRoutes = require("./routes/downloads")
const revenueRoutes = require("./routes/revenue")
const partnershipRoutes = require("./routes/partnership")
const partnersRoutes = require("./routes/partners")


const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Create uploads directory if it doesn't exist
const fs = require("fs")
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads")
}

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/donations", donationRoutes)
app.use("/api/blogs", blogRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/announcements", announcementRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/publications", publicationRoutes)
app.use("/api/journals", journalRoutes)
app.use("/api/gallery", galleryRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/downloads", downloadRoutes)
app.use("/api/revenue", revenueRoutes)
app.use("/api/partnership", partnershipRoutes)
app.use("/api/partners", partnersRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    status: "healthy",
  })
})

// 404 handler for unknown routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error("Server Error:", error)
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
})

const createDefaultSuperAdmin = async () => {
  try {
    const superAdminExists = await Admin.findOne({ role: "super_admin" })

    if (!superAdminExists) {
      const superAdmin = new Admin({
        username: "superadmin",
        email: "superadmin@example.com",
        password: process.env.SUPER_ADMIN_PASSWORD || "superadmin123", // Use env variable
        role: "super_admin",
        createdAt: new Date(),
        isActive: true,
      })

      await superAdmin.save()
      console.log("✅ Default superadmin created successfully")
      console.log("⚠️  Please change the default password in production!")
    } else {
      console.log("✅ Superadmin already exists")
    }
  } catch (error) {
    console.error("❌ Error creating default superadmin:", error.message)
  }
}

// Database connection and server startup
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ Connected to MongoDB")

    // Create default superadmin after successful DB connection
    await createDefaultSuperAdmin()

    // Start the server
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error.message)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err.message)
  process.exit(1)
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message)
  process.exit(1)
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("📴 SIGTERM received, shutting down gracefully")
  await mongoose.connection.close()
  process.exit(0)
})

process.on("SIGINT", async () => {
  console.log("📴 SIGINT received, shutting down gracefully")
  await mongoose.connection.close()
  process.exit(0)
})

// Start the server
startServer()