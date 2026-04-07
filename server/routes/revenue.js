const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/adminAuth');
const Purchase = require('../models/Purchase');
const Publication = require('../models/Publication');
const Journal = require('../models/Journal');
const User = require('../models/User');

// Get payment statistics and details
router.get('/admin/payments', adminAuth, async (req, res) => {
  try {
    // Get overall statistics
    const stats = await Purchase.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalPurchases: { $sum: 1 },
          avgTransactionValue: { $avg: '$amount' }
        }
      }
    ]);

    // Get revenue by item type
    const revenueByType = await Purchase.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: '$itemType',
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent payments with details
    const payments = await Purchase.find({ paymentStatus: 'completed' })
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(50);

    // Enrich payments with item details
    const enrichedPayments = await Promise.all(payments.map(async (payment) => {
      let itemDetails = null;
      if (payment.itemType === 'publication') {
        itemDetails = await Publication.findById(payment.itemId, 'title authors');
      } else if (payment.itemType === 'journal') {
        itemDetails = await Journal.findById(payment.itemId, 'title issn volume issue');
      }
      
      return {
        ...payment.toObject(),
        itemDetails
      };
    }));

    // Get top items by revenue
    const topItems = await Purchase.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: { itemType: '$itemType', itemId: '$itemId' },
          revenue: { $sum: '$amount' },
          purchases: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    // Enrich top items with details
    const enrichedTopItems = await Promise.all(topItems.map(async (item) => {
      let details = null;
      if (item._id.itemType === 'publication') {
        details = await Publication.findById(item._id.itemId, 'title authors');
      } else if (item._id.itemType === 'journal') {
        details = await Journal.findById(item._id.itemId, 'title issn volume issue');
      }
      
      return {
        ...item,
        details
      };
    }));

    res.json({
      stats: stats[0] || { totalRevenue: 0, totalPurchases: 0, avgTransactionValue: 0 },
      revenueByType,
      payments: enrichedPayments,
      topItems: enrichedTopItems
    });
  } catch (error) {
    console.error('Error fetching payment data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;