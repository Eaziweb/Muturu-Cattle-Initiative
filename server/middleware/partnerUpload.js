// middleware/partnerUpload.js
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary storage for partner logos
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'partner_logos', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'], // Allowed formats
    transformation: [
      { width: 300, height: 200, crop: 'limit' }, // Limit dimensions
      { quality: 'auto:best' } // Optimize quality
    ],
  },
});

// Set up multer with the storage configuration
const upload = multer({ 
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Limit file size to 2MB
  },
  fileFilter: (req, file, cb) => {
    // Check if the file is an image
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;