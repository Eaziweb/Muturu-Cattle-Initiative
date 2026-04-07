// api/index.js  ← rename/move your server.js here
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

// const Admin = require("./routes/admin")
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

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))



// ─── Routes ──────────────────────────────────────────────────────────────────
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

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    status: "healthy",
  })
})

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" })
})

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((error, req, res, next) => {
  console.error("Server Error:", error)
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
})

// ─── MongoDB: cached connection (critical for serverless) ─────────────────────
let isConnected = false

const connectDB = async () => {
  if (isConnected) return // reuse existing connection on warm invocations

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // fail fast rather than hanging
  })

  isConnected = true
  console.log("✅ Connected to MongoDB")
  await createDefaultSuperAdmin()
}

const createDefaultSuperAdmin = async () => {
  try {
    const exists = await Admin.findOne({ role: "super_admin" })
    if (!exists) {
      const superAdmin = new Admin({
        username: "superadmin",
        email: "superadmin@example.com",
        password: process.env.SUPER_ADMIN_PASSWORD || "superadmin123",
        role: "super_admin",
        createdAt: new Date(),
        isActive: true,
      })
      await superAdmin.save()
      console.log("✅ Default superadmin created")
      console.log("⚠️  Change the default password in production!")
    }
  } catch (err) {
    console.error("❌ Error creating superadmin:", err.message)
  }
}

module.exports = async (req, res) => {
  await connectDB()
  return app(req, res)
}