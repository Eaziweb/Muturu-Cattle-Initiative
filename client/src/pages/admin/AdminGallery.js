"use client"

import { useState, useEffect, useRef } from "react"
import adminApi from "../../utils/adminApi"
import styles from "../../styles/AdminGallery.module.css"

const AdminGallery = () => {
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedGallery, setSelectedGallery] = useState(null)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublished: true,
  })

  useEffect(() => {
    fetchGalleries()
  }, [])

  const fetchGalleries = async () => {
    try {
      setLoading(true)
      const response = await adminApi.get("/gallery/admin/all")
      setGalleries(response.data)
    } catch (error) {
      setError("Failed to fetch galleries")
      console.error("Error fetching galleries:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      isPublished: true,
    })
    setShowForm(false)
    setEditingId(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleEdit = (gallery) => {
    setFormData({
      title: gallery.title,
      description: gallery.description,
      isPublished: gallery.isPublished,
    })
    setEditingId(gallery._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this gallery?")) {
      try {
        await adminApi.delete(`/gallery/admin/${id}`)
        fetchGalleries()
      } catch (error) {
        setError("Failed to delete gallery")
      }
    }
  }

  const handleDeleteImage = async (galleryId, imageIndex) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await adminApi.delete(`/gallery/admin/${galleryId}/images/${imageIndex}`)
        fetchGalleries()
        // Update selected gallery if it's open
        if (selectedGallery && selectedGallery._id === galleryId) {
          const updatedGallery = galleries.find((g) => g._id === galleryId)
          if (updatedGallery) {
            setSelectedGallery(updatedGallery)
          }
        }
      } catch (error) {
        setError("Failed to delete image")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const submitData = new FormData()
    submitData.append("title", formData.title)
    submitData.append("description", formData.description)
    submitData.append("isPublished", formData.isPublished)

    // Add files if selected
    if (fileInputRef.current && fileInputRef.current.files.length > 0) {
      Array.from(fileInputRef.current.files).forEach((file) => {
        submitData.append("images", file)
      })
    }

    try {
      if (editingId) {
        await adminApi.put(`/gallery/admin/${editingId}`, {
          title: formData.title,
          description: formData.description,
          isPublished: formData.isPublished,
        })
      } else {
        await adminApi.post("/gallery/admin", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      resetForm()
      fetchGalleries()
    } catch (error) {
      setError("Failed to save gallery")
      console.error("Error saving gallery:", error)
    }
  }

  const handleAddImages = async (galleryId) => {
    if (!fileInputRef.current || fileInputRef.current.files.length === 0) {
      setError("Please select images to upload")
      return
    }

    const submitData = new FormData()
    Array.from(fileInputRef.current.files).forEach((file) => {
      submitData.append("images", file)
    })

    try {
      await adminApi.post(`/gallery/admin/${galleryId}/images`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      fetchGalleries()
      setShowImageUpload(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      setError("Failed to add images")
      console.error("Error adding images:", error)
    }
  }

  const openGalleryModal = (gallery) => {
    setSelectedGallery(gallery)
  }

  const closeGalleryModal = () => {
    setSelectedGallery(null)
  }

  return (
    <div className={styles.adminGalleryPage}>
      <div className={styles.adminHeader}>
        <h1>Gallery Management</h1>
        <button className={styles.createBtn} onClick={() => setShowForm(true)}>
          Create New Gallery
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {showForm && (
        <div className={styles.galleryFormModal}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>{editingId ? "Edit Gallery" : "Create New Gallery"}</h2>
              <button className={styles.closeBtn} onClick={resetForm}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.galleryForm}>
              <div className={styles.formGroup}>
                <label>Gallery Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
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

              {!editingId && (
                <div className={styles.formGroup}>
                  <label>Upload Images</label>
                  <input type="file" ref={fileInputRef} multiple accept="image/*" />
                  <small>You can select multiple images at once</small>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  />
                  Published
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit">{editingId ? "Update Gallery" : "Create Gallery"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showImageUpload && (
        <div className={styles.imageUploadModal}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Add Images to Gallery</h2>
              <button className={styles.closeBtn} onClick={() => setShowImageUpload(false)}>
                ×
              </button>
            </div>

            <div className={styles.uploadForm}>
              <div className={styles.formGroup}>
                <label>Select Images</label>
                <input type="file" ref={fileInputRef} multiple accept="image/*" />
              </div>

              <div className={styles.formActions}>
                <button onClick={() => setShowImageUpload(false)}>Cancel</button>
                <button onClick={() => handleAddImages(showImageUpload)}>Add Images</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.galleriesList}>
        <h2>All Galleries ({galleries.length})</h2>
        {loading ? (
          <div className={styles.loading}>Loading galleries...</div>
        ) : galleries.length === 0 ? (
          <div className={styles.noGalleries}>No galleries found</div>
        ) : (
          <div className={styles.galleriesGrid}>
            {galleries.map((gallery) => (
              <div key={gallery._id} className={styles.galleryCard}>
                <div className={styles.galleryPreview} onClick={() => openGalleryModal(gallery)}>
                  {gallery.images.length > 0 ? (
                    <div className={styles.previewImages}>
                      {gallery.images.slice(0, 4).map((image, index) => (
                        <div key={index} className={styles.previewImage}>
                          <img src={image.url} alt={`Preview ${index + 1}`} />
                        </div>
                      ))}
                      {gallery.images.length > 4 && <div className={styles.moreImages}>+{gallery.images.length - 4}</div>}
                    </div>
                  ) : (
                    <div className={styles.noImages}>No images</div>
                  )}
                </div>

                <div className={styles.galleryInfo}>
                  <div className={styles.galleryHeader}>
                    <h3>{gallery.title}</h3>
                    <span className={`${styles.statusBadge} ${gallery.isPublished ? styles.published : styles.draft}`}>
                      {gallery.isPublished ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </div>
                  <p>{gallery.description}</p>
                  <span className={styles.imageCount}>{gallery.images.length} images</span>

                  <div className={styles.galleryActions}>
                    <button onClick={() => handleEdit(gallery)}>Edit</button>
                    <button onClick={() => setShowImageUpload(gallery._id)}>Add Images</button>
                    <button onClick={() => handleDelete(gallery._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Modal */}
      {selectedGallery && (
        <div className={styles.modalOverlay} onClick={closeGalleryModal}>
          <div className={styles.galleryModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={closeGalleryModal}>
              &times;
            </button>

            <div className={styles.modalHeader}>
              <h2>{selectedGallery.title}</h2>
              <p>{selectedGallery.description}</p>
            </div>

            <div className={styles.modalImages}>
              {selectedGallery.images.map((image, index) => (
                <div key={index} className={styles.modalImage}>
                  <img src={image.url} alt={`Image ${index + 1}`} />
                  <div className={styles.imageActions}>
                    <button className={styles.deleteImageBtn} onClick={() => handleDeleteImage(selectedGallery._id, index)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminGallery