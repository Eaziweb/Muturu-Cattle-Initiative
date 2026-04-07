const express = require("express")
const axios = require("axios")
const crypto = require("crypto")
const { auth } = require("../middleware/auth")
const Publication = require("../models/Publication")
const Journal = require("../models/Journal")
const Purchase = require("../models/Purchase")
const { sendDownloadEmail } = require("../utils/emailService")

const router = express.Router()

// Initialize Flutterwave payment
router.post("/initialize", auth, async (req, res) => {
  try {
    const { itemType, itemId } = req.body

    if (!itemType || !itemId) {
      return res.status(400).json({ message: "Item type and ID are required" })
    }

    // Get item details
    let item
    let itemModel
    if (itemType === "publication") {
      item = await Publication.findById(itemId)
      itemModel = "Publication"
    } else if (itemType === "journal") {
      item = await Journal.findById(itemId)
      itemModel = "Journal"
    } else {
      return res.status(400).json({ message: "Invalid item type" })
    }

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    // Generate unique transaction reference
    const txRef = `TXN-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Create purchase record
    const purchase = new Purchase({
      user: req.user.id,
      itemType,
      itemId,
      itemModel,
      amount: item.price,
      currency: item.currency,
      paymentStatus: "pending",
      transactionId: txRef,
      flutterwaveRef: txRef,
    })

    await purchase.save()

    // Initialize Flutterwave payment
    const flutterwaveData = {
      tx_ref: txRef,
      amount: item.price,
      currency: item.currency,
      redirect_url: `${process.env.FRONTEND_URL}/payment/verify`,
      customer: {
        email: req.user.email,
        name: req.user.fullName,
      },
      customizations: {
        title: item.title,
        description: `Purchase of ${itemType}: ${item.title}`,
        logo: process.env.LOGO_URL || "",
      },
      meta: {
        purchaseId: purchase._id.toString(),
        itemType,
        itemId: itemId.toString(),
      },
    }

    const response = await axios.post("https://api.flutterwave.com/v3/payments", flutterwaveData, {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    res.json({
      status: "success",
      message: "Payment initialized",
      data: response.data.data,
      purchaseId: purchase._id,
    })
  } catch (error) {
    console.error("Payment initialization error:", error)
    res.status(500).json({
      message: "Error initializing payment",
      error: error.response?.data || error.message,
    })
  }
})

// Verify payment
// Verify payment
router.get("/verify/:transactionId", auth, async (req, res) => {
  try {
    const { transactionId } = req.params

    // Verify payment with Flutterwave
    const response = await axios.get(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      },
    })

    const paymentData = response.data.data

    if (paymentData.status === "successful") {
      // Find purchase record
      const purchase = await Purchase.findOne({ transactionId: paymentData.tx_ref })

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" })
      }

      // Update purchase status
      purchase.paymentStatus = "completed"

      // Generate download token (valid for 24 hours)
      const downloadToken = crypto.randomBytes(32).toString("hex")
      purchase.downloadToken = downloadToken
      purchase.downloadTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      await purchase.save()

      let item
      if (purchase.itemType === "publication") {
        item = await Publication.findById(purchase.itemId)
        await Publication.findByIdAndUpdate(purchase.itemId, {
          $inc: { purchaseCount: 1 },
        })
      } else {
        item = await Journal.findById(purchase.itemId)
        await Journal.findByIdAndUpdate(purchase.itemId, {
          $inc: { purchaseCount: 1 },
        })
      }

      try {
        const downloadLink = `${process.env.FRONTEND_URL}/download/${downloadToken}`

        await sendDownloadEmail(req.user.email, {
          userName: req.user.fullName,
          itemTitle: item.title,
          downloadLink: downloadLink,
          expiryDate: purchase.downloadTokenExpiry,
          expiryHours: 24,
        })

        purchase.emailSent = true
        await purchase.save()
        console.log("Email sent successfully")
      } catch (emailError) {
        console.error("Error sending email, but continuing with process:", emailError)
      }

      res.json({
        status: "success",
        message: "Payment verified successfully",
        downloadToken, // Include the download token in the response
        downloadLink: `${process.env.FRONTEND_URL}/download/${downloadToken}`,
      })
    } else {
      // Update purchase as failed
      await Purchase.findOneAndUpdate({ transactionId: paymentData.tx_ref }, { paymentStatus: "failed" })

      res.status(400).json({
        status: "failed",
        message: "Payment verification failed",
      })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    res.status(500).json({
      message: "Error verifying payment",
      error: error.response?.data || error.message,
    })
  }
})

// Flutterwave webhook
router.post("/webhook", async (req, res) => {
  try {
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH
    const signature = req.headers["verif-hash"]

    if (!signature || signature !== secretHash) {
      return res.status(401).json({ message: "Invalid signature" })
    }

    const payload = req.body

    if (payload.event === "charge.completed" && payload.data.status === "successful") {
      const purchase = await Purchase.findOne({ transactionId: payload.data.tx_ref })

      if (purchase && purchase.paymentStatus === "pending") {
        purchase.paymentStatus = "completed"

        // Generate download token
        const downloadToken = crypto.randomBytes(32).toString("hex")
        purchase.downloadToken = downloadToken
        purchase.downloadTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

        await purchase.save()

        let item
        if (purchase.itemType === "publication") {
          item = await Publication.findById(purchase.itemId)
          await Publication.findByIdAndUpdate(purchase.itemId, {
            $inc: { purchaseCount: 1 },
          })
        } else {
          item = await Journal.findById(purchase.itemId)
          await Journal.findByIdAndUpdate(purchase.itemId, {
            $inc: { purchaseCount: 1 },
          })
        }

        const user = await require("../models/User").findById(purchase.user)
        try {
          const downloadLink = `${process.env.FRONTEND_URL}/download/${downloadToken}`

          await sendDownloadEmail(user.email, {
            userName: user.fullName,
            itemTitle: item.title,
            downloadLink: downloadLink,
            expiryDate: purchase.downloadTokenExpiry,
            expiryHours: 24,
          })

          purchase.emailSent = true
          await purchase.save()
        } catch (emailError) {
          console.error("Error sending email:", emailError)
        }
      }
    }

    res.status(200).json({ status: "success" })
  } catch (error) {
    console.error("Webhook error:", error)
    res.status(500).json({ message: "Webhook processing error" })
  }
})

module.exports = router
