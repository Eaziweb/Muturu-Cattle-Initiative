const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

// Only load dotenv locally, Vercel injects env vars directly
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

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
// NO express.static — Vercel filesystem is read-only, use Cloudinary URLs directly
// NO fs.mkdirSync — same reason

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/donations", donationRoutes)
app.use("/blogs", blogRoutes)
app.use("/contact", contactRoutes)
app.use("/announcements", announcementRoutes)
app.use("/admin", adminRoutes)
app.use("/publications", publicationRoutes)
app.use("/journals", journalRoutes)
app.use("/gallery", galleryRoutes)
app.use("/events", eventRoutes)
app.use("/payments", paymentRoutes)
app.use("/downloads", downloadRoutes)
app.use("/revenue", revenueRoutes)
app.use("/partnership", partnershipRoutes)
app.use("/partners", partnersRoutes)

// ─── Health check ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    status: "healthy",
  })
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

let isConnected = false

const connectDB = async () => {
  if (isConnected) return

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set")
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })

  isConnected = true
  console.log("✅ Connected to MongoDB")
}

// ─── Serverless export (Vercel calls this per request) ────────────────────────
module.exports = async (req, res) => {
  await connectDB()
  return app(req, res)
}

app.get('/', (req, res) => {
  res.status(200).json({
    message: "Muturu Cattle Initiative API is live and connected!",
    status: "Healthy"
  });
});