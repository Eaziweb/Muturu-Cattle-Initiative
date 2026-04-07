// routes/partnerRoutes.js
const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');
const { adminAuth } = require('../middleware/adminAuth');
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/partnerUpload'); // Use the new partner upload middleware

// Get all partners (for public use, e.g., home page)
router.get('/', async (req, res) => {
  try {
    const partners = await Partner.find({ isActive: true }).sort({ order: 1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all partners (including inactive)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const partners = await Partner.find().sort({ order: 1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create a new partner
router.post('/admin', adminAuth, upload.single('logo'), async (req, res) => {
  try {
    const { name, description, order } = req.body;

    const partner = new Partner({
      name,
      description: description || '',
      logo: req.file ? req.file.path : '', // Cloudinary URL if file uploaded
      order: order || 0,
    });

    const savedPartner = await partner.save();
    res.status(201).json(savedPartner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update a partner
router.put('/admin/:id', adminAuth, upload.single('logo'), async (req, res) => {
  try {
    const { name, description, order, isActive } = req.body;
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    partner.name = name || partner.name;
    partner.description = description || partner.description;
    partner.order = order !== undefined ? order : partner.order;
    partner.isActive = isActive !== undefined ? isActive : partner.isActive;

    if (req.file) {
      // If a new logo is uploaded, delete the old one from Cloudinary
      if (partner.logo) {
        const publicId = partner.logo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      partner.logo = req.file.path;
    }

    const updatedPartner = await partner.save();
    res.json(updatedPartner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete a partner
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Delete the logo from Cloudinary if it exists
    if (partner.logo) {
      try {
        // Extract public_id from Cloudinary URL
        // Cloudinary URLs are in format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/public_id.format
        const urlParts = partner.logo.split('/');
        // Find the index of 'upload' in the URL
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex !== -1 && uploadIndex + 1 < urlParts.length) {
          // The public_id includes any folders and the version number
          const publicIdWithVersion = urlParts.slice(uploadIndex + 1).join('/');
          // Remove the file extension
          const publicId = publicIdWithVersion.split('.')[0];
          
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with partner deletion even if image deletion fails
      }
    }

    // Use deleteOne() instead of the deprecated remove()
    await Partner.deleteOne({ _id: partner._id });
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ message: error.message || 'Failed to delete partner' });
  }
});

module.exports = router;