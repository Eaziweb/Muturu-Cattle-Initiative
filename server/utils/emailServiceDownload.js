const nodemailer = require("nodemailer")

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Send download email
const sendDownloadEmail = async (to, data) => {
  const { userName, itemTitle, downloadLink, expiryHours } = data

  const mailOptions = {
    from: `"Academic Publications" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Download Link is Ready",
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
            <h1>Download Ready!</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>Thank you for your purchase! Your download link for <strong>${itemTitle}</strong> is now ready.</p>
            
            <div style="text-align: center;">
              <a href="${downloadLink}" class="button">Download Now</a>
            </div>
            
            <div class="warning">
              <strong>Important Information:</strong>
              <ul>
                <li>This link will expire in ${expiryHours} hours</li>
                <li>You can download the file up to 3 times</li>
                <li>Do not share this link with others</li>
                <li>If you experience any issues, please contact support</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4CAF50;">${downloadLink}</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Academic Publications. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  await transporter.sendMail(mailOptions)
}

module.exports = { sendDownloadEmail }
