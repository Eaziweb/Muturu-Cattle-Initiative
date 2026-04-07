const express = require("express")
const axios = require("axios")
const Donation = require("../models/Donation")
const { adminAuth } = require("../middleware/adminAuth")

const router = express.Router()

// Initialize donation
router.post("/initialize", async (req, res) => {
  try {
    const { amount, email, name, phone, purpose, message, anonymous } = req.body

    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create donation record
    const donation = new Donation({
      transactionId,
      donorName: name,
      donorEmail: email,
      donorPhone: phone,
      amount,
      purpose,
      message,
      anonymous,
      status: "pending",
    })

    await donation.save()

    // Initialize Flutterwave payment
    const flutterwaveData = {
      tx_ref: donation.transactionId,
      amount: amount,
      currency: "NGN",
      redirect_url: `${process.env.FRONTEND_URL}/donation-callback`,
      customer: {
        email: email,
        name: name,
        phonenumber: phone,
      },
      customizations: {
        title: "Agricultural Research Network Donation",
        description: purpose,
        logo: "",
      },
    }

    const response = await axios.post("https://api.flutterwave.com/v3/payments", flutterwaveData, {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (response.data.status === "success") {
      donation.flutterwaveRef = response.data.data.id
      await donation.save()

      res.json({
        status: "success",
        data: {
          link: response.data.data.link,
          transactionId: donation.transactionId,
        },
      })
    } else {
      donation.status = "failed"
      await donation.save()
      res.status(400).json({ message: "Failed to initialize payment" })
    }
  } catch (error) {
    console.error("Donation initialization error:", error)
    res.status(500).json({ message: "Server error during donation initialization" })
  }
})

router.post("/verify/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params;

    const donation = await Donation.findOne({ transactionId });
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    // If already verified, return current status
    if (donation.status !== "pending") {
      return res.json({ 
        status: "success", 
        message: "Donation already verified",
        donation 
      });
    }

    // Verify with Flutterwave using tx_ref (transactionId)
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    const { data, status } = response.data;
    console.log("Flutterwave response:", { status, data });

    if (status === "success") {
      // Update donation record
      donation.status = data.status === "successful" ? "successful" : 
                        data.status === "failed" ? "failed" : 
                        data.status === "cancelled" ? "cancelled" : donation.status;
      donation.flutterwaveRef = data.id; // Save the Flutterwave transaction ID
      await donation.save();
      console.log("Donation updated to:", donation.status);

      return res.json({ 
        status: "success", 
        message: "Donation verified",
        donation 
      });
    } else {
      // Mark donation as failed if verification fails
      donation.status = "failed";
      await donation.save();
      console.log("Donation marked as failed");

      return res.status(400).json({
        status: "failed",
        message: "Donation verification failed",
      });
    }
  } catch (error) {
    console.error("Donation verification error:", error.response?.data || error.message);
    
    // Try to mark donation as failed on error
    try {
      const donation = await Donation.findOne({ transactionId: req.params.transactionId });
      if (donation) {
        donation.status = "failed";
        await donation.save();
      }
    } catch (saveError) {
      console.error("Failed to mark donation as failed:", saveError);
    }
    
    res.status(500).json({ 
      status: "error", 
      message: "Donation verification failed",
      error: error.message 
    });
  }
});


// Admin: Get donation statistics
router.get("/admin/stats", adminAuth, async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({ status: "successful" })
    const totalRevenue = await Donation.aggregate([
      { $match: { status: "successful" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    const monthlyRevenue = await Donation.aggregate([
      { $match: { status: "successful" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ])

    res.json({
      totalDonations,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue,
    })
  } catch (error) {
    console.error("Get donation stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin: Get all donations
router.get("/admin/donations", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "" } = req.query

    const query = {}
    if (status) {
      query.status = status
    }

    const donations = await Donation.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Donation.countDocuments(query)

    res.json({
      donations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get donations error:", error)
    res.status(500).json({ message: "Server error" })
  }
})
// Webhook endpoint for Flutterwave
// Webhook endpoint for Flutterwave
router.post("/webhook", async (req, res) => {
  try {
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
    const signature = req.headers["verif-hash"];
    
    if (!signature || signature !== secretHash) {
      console.error("Webhook verification failed: Invalid signature");
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const payload = req.body;
    console.log("Webhook payload received:", JSON.stringify(payload, null, 2));
    
    // Handle charge.completed event
    if (payload.event === "charge.completed") {
      const { id, tx_ref, status, amount, currency } = payload.data;
      
      // Find donation by transaction reference (tx_ref)
      const donation = await Donation.findOne({ transactionId: tx_ref });
      if (!donation) {
        console.error(`Webhook: Donation not found for transaction ID: ${tx_ref}`);
        return res.status(404).json({ message: "Donation not found" });
      }
      
      console.log(`Updating donation ${tx_ref} from ${donation.status} to ${status}`);
      
      // Update donation status based on webhook event
      if (status === "successful") {
        donation.status = "successful";
      } else if (status === "failed") {
        donation.status = "failed";
      } else if (status === "cancelled") {
        donation.status = "cancelled";
      }
      
      // Save the updated donation
      await donation.save();
      console.log(`Donation ${tx_ref} updated to ${donation.status}`);
    }
    
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router
