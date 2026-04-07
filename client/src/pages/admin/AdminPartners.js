"use client"

import { useState, useEffect } from "react"
import adminApi from "../../utils/adminApi"
import styles from "../../styles/AdminPartners.module.css"

const AdminPartners = () => {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingPartner, setEditingPartner] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    order: 0,
    isActive: true,
  })
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileError, setFileError] = useState("")

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const response = await adminApi.get("/partners/admin/all")
      setPartners(response.data)
      setError("")
    } catch (err) {
      setError("Failed to fetch partners")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFileError("")
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFileError("Only image files are allowed")
        return
      }
      
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setFileError("File size must be less than 2MB")
        return
      }
      
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("description", formData.description)
      data.append("order", formData.order)
      data.append("isActive", formData.isActive)
      if (logoFile) {
        data.append("logo", logoFile)
      }

      if (editingPartner) {
        await adminApi.put(`/partners/admin/${editingPartner._id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      } else {
        await adminApi.post("/partners/admin", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      }

      fetchPartners()
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save partner")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      description: partner.description,
      order: partner.order,
      isActive: partner.isActive,
    })
    setLogoPreview(partner.logo)
    setLogoFile(null)
    setFileError("")
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      try {
        await adminApi.delete(`/partners/admin/${id}`)
        fetchPartners()
      } catch (err) {
        setError("Failed to delete partner")
        console.error(err)
      }
    }
  }

  const resetForm = () => {
    setEditingPartner(null)
    setFormData({
      name: "",
      description: "",
      order: 0,
      isActive: true,
    })
    setLogoFile(null)
    setLogoPreview("")
    setFileError("")
  }

  return (
    <div className={styles.adminPage}>

      <div className={styles.container}>
        <div className={styles.adminHeader}>
          <h1>Manage Partners</h1>
          <button onClick={resetForm} className={styles.refreshBtn}>
            Add New Partner
          </button>
        </div>

        {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

        <div className={styles.adminFormContainer}>
          <h2>{editingPartner ? "Edit Partner" : "Add New Partner"}</h2>
          <form onSubmit={handleSubmit} className={styles.adminForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Partner Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="order">Display Order</label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="isActive">Active</label>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <span>Show on website</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="logo">Logo Image</label>
              <input
                type="file"
                id="logo"
                name="logo"
                onChange={handleFileChange}
                accept="image/*"
              />
              {fileError && <div className={styles.fileError}>{fileError}</div>}
              {logoPreview && (
                <div className={styles.imagePreview}>
                  <img src={logoPreview} alt="Logo preview" />
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingPartner ? "Update Partner" : "Add Partner"}
              </button>
              {editingPartner && (
                <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className={styles.adminTableContainer}>
          <h2>Current Partners</h2>
          {loading ? (
            <div className={styles.loading}>Loading partners...</div>
          ) : (
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.length > 0 ? (
                  partners.map((partner) => (
                    <tr key={partner._id}>
                      <td>
                        {partner.logo ? (
                          <img src={partner.logo} alt={partner.name} className={styles.partnerLogo} />
                        ) : (
                          <span className={styles.noLogoText}>No logo</span>
                        )}
                      </td>
                      <td>{partner.name}</td>
                      <td>{partner.description || "-"}</td>
                      <td>{partner.order}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${partner.isActive ? styles.active : styles.inactive}`}>
                          {partner.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleEdit(partner)} className={styles.editBtn}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(partner._id)} className={styles.deleteBtn}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className={styles.noData}>
                      No partners found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPartners