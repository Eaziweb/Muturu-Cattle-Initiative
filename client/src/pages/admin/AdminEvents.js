"use client"

import { useState, useEffect, useRef } from "react"
import adminApi from "../../utils/adminApi"
import styles from "../../styles/AdminEvents.module.css"

const AdminEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: "",
    theme: "",
    description: "",
    date: "",
    location: "",
    objectives: [""],
    registrationFee: "",
    callForAbstracts: false,
    abstractDeadline: "",
    accountDetails: {
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
    status: "published",
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await adminApi.get("/events/admin/all")
      setEvents(response.data)
    } catch (error) {
      setError("Failed to fetch events")
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      theme: "",
      description: "",
      date: "",
      location: "",
      objectives: [""],
      registrationFee: "",
      callForAbstracts: false,
      abstractDeadline: "",
      accountDetails: {
        bankName: "",
        accountNumber: "",
        accountName: "",
      },
      status: "published",
    })
    setShowForm(false)
    setEditingId(null)
    setPreviewUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Helper function to get image URL
  const getImageUrl = (flyer) => {
    if (!flyer) return null;
    
    // If flyer is an object (Cloudinary format)
    if (typeof flyer === 'object' && flyer.url) {
      return flyer.url;
    }
    
    // If flyer is a string (legacy format)
    return `http://localhost:5000${flyer}`;
  }

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      theme: event.theme,
      description: event.description,
      date: event.date.split("T")[0],
      location: event.location,
      objectives: event.objectives.length > 0 ? event.objectives : [""],
      registrationFee: event.registrationFee,
      callForAbstracts: event.callForAbstracts,
      abstractDeadline: event.abstractDeadline ? event.abstractDeadline.split("T")[0] : "",
      accountDetails: event.accountDetails || {
        bankName: "",
        accountNumber: "",
        accountName: "",
      },
      status: event.status,
    })
    setEditingId(event._id)
    setPreviewUrl(event.flyer ? getImageUrl(event.flyer) : "")
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await adminApi.delete(`/events/admin/${id}`)
        fetchEvents()
      } catch (error) {
        setError("Failed to delete event")
      }
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addObjective = () => {
    setFormData({
      ...formData,
      objectives: [...formData.objectives, ""],
    })
  }

  const removeObjective = (index) => {
    const newObjectives = formData.objectives.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      objectives: newObjectives,
    })
  }

  const updateObjective = (index, value) => {
    const newObjectives = [...formData.objectives]
    newObjectives[index] = value
    setFormData({
      ...formData,
      objectives: newObjectives,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const submitData = new FormData()

    // Add all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "objectives") {
        submitData.append(key, JSON.stringify(formData[key].filter((obj) => obj.trim())))
      } else if (key === "accountDetails") {
        submitData.append(key, JSON.stringify(formData[key]))
      } else {
        submitData.append(key, formData[key])
      }
    })

    // Add file if selected
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      submitData.append("flyer", fileInputRef.current.files[0])
    }

    try {
      if (editingId) {
        await adminApi.put(`/events/admin/${editingId}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        await adminApi.post("/events/admin", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      resetForm()
      fetchEvents()
    } catch (error) {
      setError("Failed to save event")
      console.error("Error saving event:", error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className={styles.adminEventsPage}>
      <div className={styles.adminHeader}>
        <h1>Events Management</h1>
        <button className={styles.createBtn} onClick={() => setShowForm(true)}>
          Create New Event
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {showForm && (
        <div className={styles.eventFormModal}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>{editingId ? "Edit Event" : "Create New Event"}</h2>
              <button className={styles.closeBtn} onClick={resetForm}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.eventForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Theme *</label>
                  <input
                    type="text"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="4"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Event Objectives</label>
                {formData.objectives.map((objective, index) => (
                  <div key={index} className={styles.objectiveInput}>
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      placeholder={`Objective ${index + 1}`}
                    />
                    {formData.objectives.length > 1 && (
                      <button type="button" onClick={() => removeObjective(index)}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addObjective}>
                  Add Objective
                </button>
              </div>

              <div className={styles.formGroup}>
                <label>Event Flyer</label>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                {previewUrl && (
                  <div className={styles.imagePreview}>
                    <img src={previewUrl || "/placeholder.svg"} alt="Preview" />
                  </div>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Registration Fee</label>
                  <input
                    type="text"
                    value={formData.registrationFee}
                    onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                    placeholder="₦15,000"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.callForAbstracts}
                      onChange={(e) => setFormData({ ...formData, callForAbstracts: e.target.checked })}
                    />
                    Call for Abstracts
                  </label>
                </div>
              </div>

              {formData.callForAbstracts && (
                <div className={styles.formGroup}>
                  <label>Abstract Deadline</label>
                  <input
                    type="date"
                    value={formData.abstractDeadline}
                    onChange={(e) => setFormData({ ...formData, abstractDeadline: e.target.value })}
                  />
                </div>
              )}

              <div className={styles.accountDetailsSection}>
                <h3>Account Details</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Bank Name</label>
                    <input
                      type="text"
                      value={formData.accountDetails.bankName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountDetails: { ...formData.accountDetails, bankName: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Account Number</label>
                    <input
                      type="text"
                      value={formData.accountDetails.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountDetails: { ...formData.accountDetails, accountNumber: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Account Name</label>
                  <input
                    type="text"
                    value={formData.accountDetails.accountName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountDetails: { ...formData.accountDetails, accountName: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit">{editingId ? "Update Event" : "Create Event"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.eventsList}>
        <h2>All Events ({events.length})</h2>
        {loading ? (
          <div className={styles.loading}>Loading events...</div>
        ) : events.length === 0 ? (
          <div className={styles.noEvents}>No events found</div>
        ) : (
          <div className={styles.eventsGrid}>
            {events.map((event) => (
              <div key={event._id} className={styles.eventCard}>
                <div className={styles.eventHeader}>
                  <h3>{event.title}</h3>
                  <span className={`${styles.statusBadge} ${styles[event.status]}`}>
                    {event.status.toUpperCase()}
                  </span>
                </div>
                <div className={styles.eventDetails}>
                  <p>
                    <strong>Theme:</strong> {event.theme}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(event.date)}
                  </p>
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p>
                    <strong>Fee:</strong> {event.registrationFee}
                  </p>
                </div>
                <div className={styles.eventActions}>
                  <button onClick={() => handleEdit(event)}>Edit</button>
                  <button onClick={() => handleDelete(event._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminEvents