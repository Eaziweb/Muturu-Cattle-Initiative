// utils/emailService.js
const nodemailer = require("nodemailer")

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Changed from EMAIL_PASSWORD to EMAIL_PASS
  },
})

const sendDownloadEmail = async (to, data) => {
  const { userName, itemTitle, downloadLink, expiryDate, expiryHours } = data

  // Format expiry date properly
  const formattedExpiryDate = new Date(expiryDate).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const mailOptions = {
    from: `"Academic Publications" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Download Link is Ready - Academic Publications",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank you for your purchase!</h1>
          </div>
          <div class="content">
            <p>Dear ${userName},</p>
            <p>Your payment has been confirmed. You can now download <strong>${itemTitle}</strong>.</p>
            
            <div style="text-align: center;">
              <h3>Download Link:</h3>
              <a href="${downloadLink}" class="button">Download Now</a>
            </div>
            
            <div class="warning">
              <strong>Important:</strong>
              <ul>
                <li>This link expires on <strong>${formattedExpiryDate}</strong></li>
                <li>You can download this file up to <strong>3 times</strong></li>
                <li>Keep this email for your records</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4CAF50;">${downloadLink}</p>
            
            <p>If you have any issues, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>Best regards,</p>
            <p><strong>Academic Publications Team</strong></p>
            <p style="margin-top: 20px;">${process.env.FRONTEND_URL || "https://yourwebsite.com"}</p>
            <p>&copy; ${new Date().getFullYear()} Academic Publications. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Email sent successfully to:", to)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

module.exports = { sendDownloadEmail }