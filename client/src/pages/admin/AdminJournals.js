"use client"

import { useState, useEffect, useRef } from "react"
import adminApi from "../../utils/adminApi"
import styles from "../../styles/AdminJournals.module.css"
import Navbar from "../../components/NavBar"

const AdminJournals = () => {
  const [journals, setJournals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("")
  const fileInputRef = useRef(null)
  const pdfInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: "",
    issn: "",
    volume: "",
    issue: "",
    publishedDate: "",
    description: "",
    abstract: "",
    editors: [""],
    publisher: "",
    category: "Science",
    price: "",
    currency: "NGN",
    pages: "",
    keywords: [""],
    language: "English",
    indexedIn: [""],
    impactFactor: "",
  })

  const categories = [
    "Science",
    "Technology",
    "Medicine",
    "Engineering",
    "Arts",
    "Social Sciences",
    "Business",
    "Other",
  ]

  useEffect(() => {
    fetchJournals()
  }, [])

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount, currency = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const getImageUrl = (image) => {
    if (!image) return null
    
    // If image is an object (Cloudinary format)
    if (typeof image === 'object' && image.url) {
      return image.url
    }
    
    // If image is a string (URL)
    return image
  }

  const fetchJournals = async () => {
    try {
      setLoading(true)
      const response = await adminApi.get("/journals/admin/all")
      const journalsData = response.data.journals || []
      setJournals(journalsData)
    } catch (error) {
      setError("Failed to fetch journals")
      console.error("Error fetching journals:", error)
      setJournals([])
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      issn: "",
      volume: "",
      issue: "",
      publishedDate: "",
      description: "",
      abstract: "",
      editors: [""],
      publisher: "",
      category: "Science",
      price: "",
      currency: "NGN",
      pages: "",
      keywords: [""],
      language: "English",
      indexedIn: [""],
      impactFactor: "",
    })
    setShowForm(false)
    setEditingId(null)
    setPreviewUrl("")
    setPdfPreviewUrl("")
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (pdfInputRef.current) pdfInputRef.current.value = ""
  }

  const handleEdit = (journal) => {
    setFormData({
      title: journal.title || "",
      issn: journal.issn || "",
      volume: journal.volume || "",
      issue: journal.issue || "",
      publishedDate: journal.publishedDate ? journal.publishedDate.split("T")[0] : "",
      description: journal.description || "",
      abstract: journal.abstract || "",
      editors: journal.editors && journal.editors.length > 0 ? journal.editors : [""],
      publisher: journal.publisher || "",
      category: journal.category || "Science",
      price: journal.price || "",
      currency: journal.currency || "NGN",
      pages: journal.pages || "",
      keywords: journal.keywords && journal.keywords.length > 0 ? journal.keywords : [""],
      language: journal.language || "English",
      indexedIn: journal.indexedIn && journal.indexedIn.length > 0 ? journal.indexedIn : [""],
      impactFactor: journal.impactFactor || "",
    })
    setEditingId(journal._id)
    setPreviewUrl(journal.coverImage ? getImageUrl(journal.coverImage) : "")
    setPdfPreviewUrl(journal.cloudinaryUrl ? journal.cloudinaryUrl : "")
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this journal?")) {
      try {
        await adminApi.delete(`/journals/admin/${id}`)
        fetchJournals()
      } catch (error) {
        setError("Failed to delete journal")
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

  const handlePdfChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPdfPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    })
  }

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData({
      ...formData,
      [field]: newArray.length > 0 ? newArray : [""],
    })
  }

  const updateArrayItem = (field, index, value) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({
      ...formData,
      [field]: newArray,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const submitData = new FormData()

    // Add all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "editors" || key === "keywords" || key === "indexedIn") {
        submitData.append(key, JSON.stringify(formData[key].filter((item) => item.trim())))
      } else {
        submitData.append(key, formData[key])
      }
    })

    // Add files if selected
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      submitData.append("coverImage", fileInputRef.current.files[0])
    }
    if (pdfInputRef.current && pdfInputRef.current.files[0]) {
      submitData.append("file", pdfInputRef.current.files[0])
    }

    try {
      if (editingId) {
        await adminApi.put(`/journals/admin/${editingId}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        await adminApi.post("/journals/admin", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      resetForm()
      fetchJournals()
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save journal")
      console.error("Error saving journal:", error)
    }
  }

  return (
    <div className={styles.adminPublicationsPage}>
            <Navbar />

      <div className={styles.adminHeader}>
        <h1>Journals Management</h1>
        <button className={styles.createBtn} onClick={() => setShowForm(true)}>
          Add New Journal
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {showForm && (
        <div className={styles.publicationFormModal}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>{editingId ? "Edit Journal" : "Add New Journal"}</h2>
              <button className={styles.closeBtn} onClick={resetForm}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.publicationForm}>
              <div className={styles.formGroup}>
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>ISSN</label>
                  <input
                    type="text"
                    value={formData.issn}
                    onChange={(e) => setFormData({ ...formData, issn: e.target.value })}
                    placeholder="ISSN-XXXX-XXXX"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Volume</label>
                  <input
                    type="text"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Issue</label>
                  <input
                    type="text"
                    value={formData.issue}
                    onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Editors *</label>
                {formData.editors.map((editor, index) => (
                  <div key={index} className={styles.arrayInput}>
                    <input
                      type="text"
                      value={editor}
                      onChange={(e) => updateArrayItem("editors", index, e.target.value)}
                      placeholder={`Editor ${index + 1}`}
                      required={index === 0}
                    />
                    {formData.editors.length > 1 && (
                      <button type="button" onClick={() => removeArrayItem("editors", index)}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem("editors")}>
                  Add Editor
                </button>
              </div>

              <div className={styles.formGroup}>
                <label>Abstract *</label>
                <textarea
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  required
                  rows="4"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="6"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Published Date *</label>
                  <input
                    type="date"
                    value={formData.publishedDate}
                    onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Pages</label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Price *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    step="0.01"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Impact Factor</label>
                  <input
                    type="number"
                    value={formData.impactFactor}
                    onChange={(e) => setFormData({ ...formData, impactFactor: e.target.value })}
                    step="0.01"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Keywords</label>
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className={styles.arrayInput}>
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => updateArrayItem("keywords", index, e.target.value)}
                      placeholder={`Keyword ${index + 1}`}
                    />
                    {formData.keywords.length > 1 && (
                      <button type="button" onClick={() => removeArrayItem("keywords", index)}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem("keywords")}>
                  Add Keyword
                </button>
              </div>

              <div className={styles.formGroup}>
                <label>Indexed In</label>
                {formData.indexedIn.map((index, idx) => (
                  <div key={idx} className={styles.arrayInput}>
                    <input
                      type="text"
                      value={index}
                      onChange={(e) => updateArrayItem("indexedIn", idx, e.target.value)}
                      placeholder={`Database ${idx + 1}`}
                    />
                    {formData.indexedIn.length > 1 && (
                      <button type="button" onClick={() => removeArrayItem("indexedIn", idx)}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem("indexedIn")}>
                  Add Database
                </button>
              </div>

              <div className={styles.formGroup}>
                <label>Language</label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Cover Image</label>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                {previewUrl && (
                  <div className={styles.imagePreview}>
                    <img src={previewUrl || "/placeholder.svg"} alt="Preview" />
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>PDF File *</label>
                <input type="file" ref={pdfInputRef} onChange={handlePdfChange} accept=".pdf" required={!editingId} />
                {pdfPreviewUrl && (
                  <div className={styles.pdfPreview}>
                    <p>PDF Preview: {pdfPreviewUrl.split('/').pop()}</p>
                  </div>
                )}
                <small>Upload the journal PDF file</small>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit">{editingId ? "Update Journal" : "Add Journal"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.publicationsList}>
        <h2>All Journals ({journals.length})</h2>
        {loading ? (
          <div className={styles.loading}>Loading journals...</div>
        ) : !journals || journals.length === 0 ? (
          <div className={styles.noPublications}>No journals found</div>
        ) : (
          <div className={styles.publicationsGrid}>
            {journals.map((journal) => (
              <div key={journal._id} className={styles.publicationCard}>
                <div className={styles.publicationHeader}>
                  <h3>{journal.title || "Untitled Journal"}</h3>
                  <span className={`${styles.statusBadge} ${journal.isActive ? styles.active : styles.inactive}`}>
                    {journal.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                
                {journal.coverImage && (
                  <div className={styles.publicationImage}>
                    <img 
                      src={getImageUrl(journal.coverImage)} 
                      alt={journal.title} 
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                )}
                
                <div className={styles.publicationDetails}>
                  <p>
                    <strong>Editors:</strong>{" "}
                    {journal.editors && journal.editors.length > 0 ? journal.editors.join(", ") : "No editors"}
                  </p>
                  <p>
                    <strong>Category:</strong> {journal.category || "Not specified"}
                  </p>
                  <p>
                    <strong>ISSN:</strong> {journal.issn || "Not specified"}
                  </p>
                  <p>
                    <strong>Volume:</strong> {journal.volume || "Not specified"} 
                    {journal.issue && `, Issue: ${journal.issue}`}
                  </p>
                  <p>
                    <strong>Published:</strong> {journal.publishedDate ? formatDate(journal.publishedDate) : "Not specified"}
                  </p>
                  <p>
                    <strong>Price:</strong> {formatCurrency(journal.price, journal.currency)}
                  </p>
                  <p>
                    <strong>Downloads:</strong> {journal.downloadCount || 0}
                  </p>
                  <p>
                    <strong>Purchases:</strong> {journal.purchaseCount || 0}
                  </p>
                </div>
                <div className={styles.publicationActions}>
                  <button onClick={() => handleEdit(journal)}>Edit</button>
                  <button onClick={() => handleDelete(journal._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminJournals