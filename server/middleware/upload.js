const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const os = require("os");
const fs = require("fs");

// Create platform-specific temp directory
const tempDir = path.join(os.tmpdir(), 'academic-uploads');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Cloudinary storage configurations
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "academic-publications/documents",
    resource_type: "raw",
    allowed_formats: ["pdf", "doc", "docx"],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `${file.fieldname}-${uniqueSuffix}`;
    },
  },
});

const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "academic-publications/covers",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 1200, crop: "limit" }],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `cover-${uniqueSuffix}`;
    },
  },
});

// Platform-independent temporary storage
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File type validation
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "file") {
    const allowedDocMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedDocExtensions = [".pdf", ".doc", ".docx"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedDocMimeTypes.includes(file.mimetype) && 
        allowedDocExtensions.includes(fileExtension)) {
      return cb(null, true);
    } else {
      const error = new Error(
        `Invalid document file type. Only PDF and DOC/DOCX files are allowed. Received: ${file.mimetype} (${fileExtension})`
      );
      return cb(error);
    }
  }

  if (file.fieldname === "coverImage") {
    const allowedImageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedImageMimeTypes.includes(file.mimetype) && 
        allowedImageExtensions.includes(fileExtension)) {
      return cb(null, true);
    } else {
      const error = new Error(
        `Invalid image file type. Only JPG, PNG, and WEBP files are allowed. Received: ${file.mimetype} (${fileExtension})`
      );
      return cb(error);
    }
  }

  const error = new Error(`Unexpected field: ${file.fieldname}`);
  cb(error);
};

// Multer configuration
const upload = multer({
  storage: tempStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: fileFilter,
});

// Cloudinary upload wrapper
const uploadToCloudinary = (fields) => {
  return async (req, res, next) => {
    upload.fields(fields)(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: err.message });
      }

      try {
        if (req.files) {
          // Process document file
          if (req.files.file && req.files.file[0]) {
            const file = req.files.file[0];
            const result = await cloudinary.uploader.upload(file.path, {
              folder: "academic-publications/documents",
              resource_type: "raw",
              public_id: `doc-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
            });

            // Update file object with Cloudinary info
            req.files.file[0].path = result.secure_url;
            req.files.file[0].filename = result.public_id;
            
            // Clean up temporary file
            try {
              fs.unlinkSync(file.path);
            } catch (cleanupError) {
              console.error("Error cleaning up temp file:", cleanupError);
            }
          }

          // Process cover image
          if (req.files.coverImage && req.files.coverImage[0]) {
            const coverImage = req.files.coverImage[0];
            const result = await cloudinary.uploader.upload(coverImage.path, {
              folder: "academic-publications/covers",
              resource_type: "image",
              transformation: [{ width: 800, height: 1200, crop: "limit" }],
              public_id: `cover-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
            });

            // Update file object with Cloudinary info
            req.files.coverImage[0].path = result.secure_url;
            req.files.coverImage[0].filename = result.public_id;
            
            // Clean up temporary file
            try {
              fs.unlinkSync(coverImage.path);
            } catch (cleanupError) {
              console.error("Error cleaning up temp file:", cleanupError);
            }
          }
        }

        next();
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ 
          message: "Error uploading files to cloud storage", 
          error: uploadError.message 
        });
      }
    });
  };
};

module.exports = {
  upload: uploadToCloudinary,
  rawUpload: upload,
};