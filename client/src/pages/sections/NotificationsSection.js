"use client"

import { useState } from "react"
import api from "../../utils/adminApi"
import styles from "../../styles/NotificationsSection.module.css"
import { 
  FiSend, 
  FiBell, 
  FiImage, 
  FiUsers, 
  FiCheck, 
  FiX, 
  FiCalendar,
  FiUser,
  FiMail,
  FiInfo
} from "react-icons/fi"

const NotificationsSection = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    image: "",
    sendToAll: true,
    selectedUsers: [],
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.message.trim()) {
      setError("Title and message are required")
      return
    }

    setLoading(true)
    setMessage("")
    setError("")

    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        image: formData.image,
        userIds: formData.sendToAll ? [] : formData.selectedUsers,
      }

      await api.post("/users/admin/send-notification", payload)
      setMessage("Notification sent successfully!")
      setFormData({
        title: "",
        message: "",
        image: "",
        sendToAll: true,
        selectedUsers: [],
      })

      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send notification")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={styles.notificationsSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerContent}>
          <FiBell className={styles.headerIcon} />
          <div>
            <h2>Send Notifications</h2>
            <p>Send notifications to verified members</p>
          </div>
        </div>
      </div>

      {message && <div className={styles.successMessage}>{message}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.contentContainer}>
        <form onSubmit={handleSubmit} className={styles.notificationForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">
              <FiMail className={styles.labelIcon} />
              Notification Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter notification title"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">
              <FiMail className={styles.labelIcon} />
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message..."
              rows="6"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">
              <FiImage className={styles.labelIcon} />
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                name="sendToAll" 
                checked={formData.sendToAll} 
                onChange={handleChange} 
              />
              <span className={styles.checkmark}>
                <FiCheck className={styles.checkIcon} />
              </span>
              <div className={styles.checkboxContent}>
                <FiUsers className={styles.checkboxIcon} />
                <span>Send to all verified members</span>
              </div>
            </label>
          </div>

          <button type="submit" className={styles.sendBtn} disabled={loading}>
            <FiSend className={styles.btnIcon} />
            {loading ? "Sending..." : "Send Notification"}
          </button>
        </form>

        <div className={styles.previewSection}>
          <h3>
            <FiInfo className={styles.previewIcon} />
            Preview
          </h3>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div className={styles.previewTitle}>
                <FiBell className={styles.previewBell} />
                <h4>{formData.title || "Notification Title"}</h4>
              </div>
              <span className={styles.previewDate}>{formatDate()}</span>
            </div>
            <p className={styles.previewMessage}>
              {formData.message || "Your message will appear here..."}
            </p>
            {formData.image && (
              <div className={styles.previewImage}>
                <img
                  src={formData.image}
                  alt="Preview"
                  onError={(e) => {
                    e.target.style.display = "none"
                    e.target.parentElement.style.display = "none"
                  }}
                />
              </div>
            )}
            <div className={styles.previewFooter}>
              <div className={styles.previewSender}>
                <FiUser className={styles.senderIcon} />
                <span>Admin</span>
              </div>
              <div className={styles.previewStatus}>
                <div className={styles.statusDot}></div>
                <span>New</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsSection