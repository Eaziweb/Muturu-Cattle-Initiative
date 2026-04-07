"use client"

import { useState, useEffect, useRef } from "react"
import api from "../../utils/adminApi"
import styles from "../../styles/BlogsSection.module.css"
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiX, FiSave, FiCalendar, FiEye, FiTag } from "react-icons/fi"

const BlogsSection = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tags: "",
    published: true,
    featured: false,
  })
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchBlogs()
  }, [currentPage, searchTerm])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/blogs/admin/all?page=${currentPage}&search=${searchTerm}`)
      setBlogs(response.data.blogs)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateBlog = () => {
    setEditingBlog(null)
    setFormData({
      title: "",
      content: "",
      image: "",
      tags: "",
      published: true,
      featured: false,
    })
    setImageFile(null)
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setShowCreateForm(true)
  }

  const handleEditBlog = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      content: blog.content,
      image: "",
      tags: blog.tags.join(", "),
      published: blog.published,
      featured: blog.featured,
    })
    setImageFile(null)
    setImagePreview(blog.image ? (typeof blog.image === "object" ? blog.image.url : blog.image) : "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setShowCreateForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setMessage("")
    setError("")

    try {
      const submitData = new FormData()

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key !== "image") {
          submitData.append(key, formData[key])
        }
      })

      // Add image file if selected
      if (imageFile) {
        submitData.append("image", imageFile)
      }

      if (editingBlog) {
        await api.put(`/blogs/admin/${editingBlog._id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        setMessage("Blog updated successfully!")
      } else {
        await api.post("/blogs/admin/create", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        setMessage("Blog created successfully!")
      }

      setShowCreateForm(false)
      setImageFile(null)
      setImagePreview("")
      fetchBlogs()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save blog")
      setTimeout(() => setError(""), 3000)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return

    try {
      await api.delete(`/blogs/admin/${blogId}`)
      setMessage("Blog deleted successfully!")
      fetchBlogs()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setError("Failed to delete blog")
      setTimeout(() => setError(""), 3000)
    }
  }

  // Helper function to get image URL
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.svg?height=100&width=150&query=blog-post"

    // If image is an object (Cloudinary format)
    if (typeof image === "object" && image.url) {
      return image.url
    }

    // If image is a string (URL)
    return image
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

  return (
    <div className={styles.blogsSection}>

      <div className={styles.sectionHeader}>
        <h2>Blog Management</h2>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
          <button className={styles.createBtn} onClick={handleCreateBlog}>
            <FiPlus className={styles.btnIcon} />
            <span>New Blog</span>
          </button>
        </div>
      </div>

      {message && <div className={styles.successMessage}>{message}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {showCreateForm && (
        <div className={styles.blogFormModal}>
          <div className={styles.blogFormContainer}>
            <div className={styles.formHeader}>
              <h3>{editingBlog ? "Edit Blog" : "Create New Blog"}</h3>
              <button className={styles.closeBtn} onClick={() => setShowCreateForm(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.blogForm}>
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
                <label htmlFor="image">Header Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                />
                {imagePreview && (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                {editingBlog && !imageFile && editingBlog.image && (
                  <div className={styles.currentImage}>
                    <img src={getImageUrl(editingBlog.image)} alt="Current" />
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tags">Tags (comma separated)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleFormChange}
                  placeholder="research, agriculture, technology"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  rows="15"
                  required
                  placeholder="Write your blog content here..."
                />
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="published" checked={formData.published} onChange={handleFormChange} />
                  <span className="checkmark"></span>
                  Published
                </label>

                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleFormChange} />
                  <span className="checkmark"></span>
                  Featured
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn} disabled={formLoading}>
                  <FiSave className={styles.btnIcon} />
                  {formLoading ? "Saving..." : editingBlog ? "Update Blog" : "Create Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading blogs...</p>
        </div>
      ) : (
        <>
          <div className={styles.blogsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>Title</div>
              <div className={styles.headerCell}>Status</div>
              <div className={styles.headerCell}>Views</div>
              <div className={styles.headerCell}>Created</div>
              <div className={styles.headerCell}>Actions</div>
            </div>
            {blogs.map((blog) => (
              <div key={blog._id} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <div className={styles.blogInfo}>
                    <h4>{blog.title}</h4>
                    <p>{blog.excerpt}</p>
                    {blog.tags.length > 0 && (
                      <div className={styles.blogTags}>
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className={styles.tag}>
                            <FiTag className={styles.tagIcon} />
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className={styles.tag}>+{blog.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.statusBadges}>
                    <span className={`${styles.statusBadge} ${blog.published ? styles.published : styles.draft}`}>
                      {blog.published ? "Published" : "Draft"}
                    </span>
                    {blog.featured && <span className={`${styles.statusBadge} ${styles.featured}`}>Featured</span>}
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.viewsCount}>
                    <FiEye className={styles.viewsIcon} />
                    <span>{blog.views}</span>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.dateInfo}>
                    <FiCalendar className={styles.dateIcon} />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.actionButtons}>
                    <button className={styles.editBtn} onClick={() => handleEditBlog(blog)}>
                      <FiEdit />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteBlog(blog._id)}>
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

export default BlogsSection