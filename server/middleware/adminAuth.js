// middleware/adminAuth.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      const err = new Error("No token, authorization denied");
      err.status = 401;
      throw err;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId).select("-password");

    if (!admin) {
      const err = new Error("Token is not valid");
      err.status = 401;
      throw err;
    }

    if (!admin.isActive) {
      const err = new Error("Admin account is inactive");
      err.status = 401;
      throw err;
    }

    // Set both req.admin and req.user for compatibility
    req.admin = admin;
    req.user = { 
      id: admin._id,
      ...admin.toObject()
    };
    next(); // Proceed to the next middleware/route
  } catch (error) {
    // Pass the error to Express global error handler
    error.status = error.status || 401;
    next(error);
  }
};

// Super admin authorization middleware
const superAdminAuth = (req, res, next) => {
  // First run adminAuth
  adminAuth(req, res, (err) => {
    if (err) return next(err); // stop if adminAuth failed

    // Check if the admin has super_admin role
    if (req.admin.role !== "super_admin") {
      const error = new Error("Access denied. Super admin only.");
      error.status = 403;
      return next(error);
    }

    next(); // Authorized
  });
};

module.exports = { adminAuth, superAdminAuth };