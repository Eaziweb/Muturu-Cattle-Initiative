const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    memberID: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    // --- Profile Information ---
    title: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    // --- Geography ---
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    // --- Academic & Research ---
    academicQualifications: {
      type: String,
      default: "",
    },
    researchDisciplines: {
      type: String,
      default: "",
    },
    googleScholarProfile: {
      type: String,
      default: "",
    },
    researchGateProfile: {
      type: String,
      default: "",
    },
    // --- Status & Security ---
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: { // Fixed: Matches your auth logic name
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // --- Notifications ---
    notifications: [
      {
        id: String,
        title: String,
        message: String,
        image: String,
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
)

// --- Middlewares ---

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// --- Methods ---

// Compare input password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", userSchema)