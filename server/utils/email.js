const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendVerificationEmail = async (email, code, memberID) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${code} is your verification code`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #006400; text-align: center;">Verify Your Email</h2>
        <p>Thank you for registering with the Muturu Cattle Network Initiative. Use the following code to verify your account:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 10px; color: #006400; background: #f0fdf4; padding: 15px 30px; border-radius: 8px; border: 2px dashed #006400;">
            ${code}
          </span>
        </div>
        
        <p style="color: #666; font-size: 14px;">This code will expire in 24 hours. If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">Member ID: ${memberID}</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

const sendWelcomeEmail = async (email, fullName, memberID) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Muturu Cattle Network Initiative!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Congratulations ${fullName}!</h2>
        <p>Your email has been successfully verified and your membership is now active.</p>
        <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Your Member Details:</h3>
          <p><strong>Member ID:</strong> ${memberID}</p>
          <p><strong>Name:</strong> ${fullName}</p>
        </div>
        <p>You can now log in to your member dashboard and access all member benefits.</p>
        <a href="${process.env.FRONTEND_URL}/login" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Dashboard</a>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset - Muturu Cattle Network Initiative",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
// ... existing imports (nodemailer, transporter)

const sendContactReplyEmail = async (email, name, originalMessage, replyText) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `RE: Contact Inquiry - Muturu Cattle Network Initiative`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <h2>Hello ${name},</h2>
        <p>Thank you for reaching out to the Agricultural Initiative. Here is our response to your inquiry:</p>
        
        <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
          <p><strong>Our Response:</strong></p>
          <p style="white-space: pre-wrap;">${replyText}</p>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <div style="color: #666; font-size: 0.9em;">
          <p><strong>Original Message sent by you:</strong></p>
          <blockquote style="font-style: italic; border-left: 2px solid #ccc; padding-left: 10px;">
            ${originalMessage}
          </blockquote>
        </div>

        <p>Best regards,<br/>The Admin Team<br/>Agricultural Initiative</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendContactReplyEmail, 
}

