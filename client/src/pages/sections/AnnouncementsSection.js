"use client"

import { useState, useEffect } from "react"
import api from "../../utils/adminApi"
import styles from "../../styles/AnnouncementsSection.module.css"
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX, 
  FiCalendar, 
  FiEye, 
  FiInfo, 
  FiAlertCircle, 
  FiFlag,
  FiUsers,
  FiCheck,
  FiClock
} from "react-icons/fi"

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "general",
    priority: "medium",
    image: "",
    expiresAt: "",
    targetAudience: "all",
    active: true,
  })
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAnnouncements()
  }, [currentPage])

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/announcements/admin/all?page=${currentPage}`)
      setAnnouncements(response.data.announcements)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Error fetching announcements:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleCreateAnnouncement = () => {
    setEditingAnnouncement(null)
    setFormData({
      title: "",
      content: "",
      type: "general",
      priority: "medium",
      image: "",
      expiresAt: "",
      targetAudience: "all",
      active: true,
    })
    setShowCreateForm(true)
  }

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      image: announcement.image || "",
      expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().split("T")[0] : "",
      targetAudience: announcement.targetAudience,
      active: announcement.active,
    })
    setShowCreateForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setMessage("")
    setError("")

    try {
      const payload = {
        ...formData,
        expiresAt: formData.expiresAt || null,
      }

      if (editingAnnouncement) {
        await api.put(`/announcements/admin/${editingAnnouncement._id}`, payload)
        setMessage("Announcement updated successfully!")
      } else {
        await api.post("/announcements/admin/create", payload)
        setMessage("Announcement created successfully!")
      }

      setShowCreateForm(false)
      fetchAnnouncements()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save announcement")
      setTimeout(() => setError(""), 3000)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return

    try {
      await api.delete(`/announcements/admin/${announcementId}`)
      setMessage("Announcement deleted successfully!")
      fetchAnnouncements()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setError("Failed to delete announcement")
      setTimeout(() => setError(""), 3000)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "urgent":
        return <FiAlertCircle className={styles.typeIcon} />
      case "event":
        return <FiCalendar className={styles.typeIcon} />
      case "update":
        return <FiInfo className={styles.typeIcon} />
      default:
        return <FiInfo className={styles.typeIcon} />
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <FiFlag className={styles.priorityIcon} />
      case "medium":
        return <FiFlag className={styles.priorityIcon} />
      default:
        return <FiFlag className={styles.priorityIcon} />
    }
  }

  return (
    <div className={styles.announcementsSection}>

      <div className={styles.sectionHeader}>
        <h2>Announcements Management</h2>
        <button className={styles.createBtn} onClick={handleCreateAnnouncement}>
          <FiPlus className={styles.btnIcon} />
          <span>New Announcement</span>
        </button>
      </div>

      {message && <div className={styles.successMessage}>{message}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {showCreateForm && (
        <div className={styles.announcementFormModal}>
          <div className={styles.announcementFormContainer}>
            <div className={styles.formHeader}>
              <h3>{editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}</h3>
              <button className={styles.closeBtn} onClick={() => setShowCreateForm(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.announcementForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="type">Type</label>
                  <div className={styles.selectWrapper}>
                    <select id="type" name="type" value={formData.type} onChange={handleFormChange}>
                      <option value="general">General</option>
                      <option value="urgent">Urgent</option>
                      <option value="event">Event</option>
                      <option value="update">Update</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="priority">Priority</label>
                  <div className={styles.selectWrapper}>
                    <select id="priority" name="priority" value={formData.priority} onChange={handleFormChange}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="targetAudience">Target Audience</label>
                  <div className={styles.selectWrapper}>
                    <select
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleFormChange}
                    >
                      <option value="all">All Users</option>
                      <option value="members">Members Only</option>
                      <option value="visitors">Visitors Only</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Image URL (Optional)</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="expiresAt">Expires At (Optional)</label>
                <input
                  type="date"
                  id="expiresAt"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleFormChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  rows="8"
                  required
                  placeholder="Write your announcement content here..."
                />
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="active" checked={formData.active} onChange={handleFormChange} />
                  <span className="checkmark"></span>
                  <FiCheck className={styles.checkboxIcon} />
                  Active
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn} disabled={formLoading}>
                  {formLoading ? "Saving..." : editingAnnouncement ? "Update Announcement" : "Create Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading announcements...</p>
        </div>
      ) : (
        <>
          <div className={styles.announcementsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>Title</div>
              <div className={styles.headerCell}>Type & Priority</div>
              <div className={styles.headerCell}>Status</div>
              <div className={styles.headerCell}>Views</div>
              <div className={styles.headerCell}>Created</div>
              <div className={styles.headerCell}>Actions</div>
            </div>
            {announcements.map((announcement) => (
              <div key={announcement._id} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <div className={styles.announcementInfo}>
                    <h4>{announcement.title}</h4>
                    <p>{announcement.content.substring(0, 100)}...</p>
                    {announcement.targetAudience !== "all" && (
                      <div className={styles.audienceBadge}>
                        <FiUsers className={styles.audienceIcon} />
                        <span>{announcement.targetAudience}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.typePriority}>
                    <span className={`${styles.typeBadge} ${announcement.type}`}>
                      {getTypeIcon(announcement.type)}
                      {announcement.type}
                    </span>
                    <span className={`${styles.priorityBadge} ${announcement.priority}`}>
                      {getPriorityIcon(announcement.priority)}
                      {announcement.priority}
                    </span>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <span className={`${styles.statusBadge} ${announcement.active ? "active" : "inactive"}`}>
                    {announcement.active ? <FiCheck className={styles.statusIcon} /> : <FiClock className={styles.statusIcon} />}
                    {announcement.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.viewsCount}>
                    <FiEye className={styles.viewsIcon} />
                    <span>{announcement.views}</span>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.dateInfo}>
                    <FiCalendar className={styles.dateIcon} />
                    <span>{formatDate(announcement.createdAt)}</span>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.actionButtons}>
                    <button className={styles.editBtn} onClick={() => handleEditAnnouncement(announcement)}>
                      <FiEdit />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteAnnouncement(announcement._id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={styles.paginationBtn}
              >
                Previous
              </button>
              <span className={styles.paginationInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={styles.paginationBtn}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AnnouncementsSection