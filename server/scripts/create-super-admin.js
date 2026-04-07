// scripts/seedSuperAdmin.js
const mongoose = require("mongoose")
require("dotenv").config()

const Admin = require("../models/Admin")

const createDefaultSuperAdmin = async () => {
  try {
    // Ensure env variables exist
    if (!process.env.SUPERADMIN_EMAIL || !process.env.SUPERADMIN_PASSWORD) {
      throw new Error("SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD is missing in .env")
    }

    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI)

    const superAdminExists = await Admin.findOne({ role: "super_admin" })

    if (!superAdminExists) {
      const superAdmin = new Admin({
        username: "superadmin",
        email: process.env.SUPERADMIN_EMAIL,
        password: process.env.SUPERADMIN_PASSWORD, // pre-save hook will hash it
        role: "super_admin",
        isActive: true,
      })

      await superAdmin.save()
      console.log("✅ Default superadmin created successfully")
      console.log("⚠️  Please change the default password in production!")
    } else {
      console.log("✅ Superadmin already exists")
    }

    mongoose.connection.close()
  } catch (error) {
    console.error("❌ Error creating default superadmin:", error.message)
    mongoose.connection.close()
  }
}

// Run the seeding function
createDefaultSuperAdmin()
