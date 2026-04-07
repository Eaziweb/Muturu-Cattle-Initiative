"use client";

import { useState, useEffect, useRef } from "react";
import adminApi from "../../utils/adminApi";
import styles from "../../styles/AdminPublications.module.css";

const AdminPublications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    authors: [""],
    abstract: "",
    keywords: [""],
    category: "Research Paper",
    publishedDate: "",
    pages: "",
    doi: "",
    isbn: "",
    publisher: "",
    journal: "",
    volume: "",
    issue: "",
    price: "",
    currency: "NGN",
    description: "",
    tags: [""],
    language: "English",
  });

  const categories = [
    "Research Paper",
    "Conference Paper",
    "Book Chapter",
    "Thesis",
    "Report",
    "Other",
  ];

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    
    // If image is an object (Cloudinary format)
    if (typeof image === 'object' && image.url) {
      return image.url;
    }
    
    // If image is a string (URL)
    return image;
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/publications/admin/all");
      const publicationsData = response.data.publications || [];
      setPublications(publicationsData);
    } catch (error) {
      setError("Failed to fetch publications");
      console.error("Error fetching publications:", error);
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      authors: [""],
      abstract: "",
      keywords: [""],
      category: "Research Paper",
      publishedDate: "",
      pages: "",
      doi: "",
      isbn: "",
      publisher: "",
      journal: "",
      volume: "",
      issue: "",
      price: "",
      currency: "NGN",
      description: "",
      tags: [""],
      language: "English",
    });
    setShowForm(false);
    setEditingId(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const handleEdit = (publication) => {
    setFormData({
      title: publication.title || "",
      authors:
        publication.authors && publication.authors.length > 0
          ? publication.authors
          : [""],
      abstract: publication.abstract || "",
      keywords:
        publication.keywords && publication.keywords.length > 0
          ? publication.keywords
          : [""],
      category: publication.category || "Research Paper",
      publishedDate: publication.publishedDate
        ? publication.publishedDate.split("T")[0]
        : "",
      pages: publication.pages || "",
      doi: publication.doi || "",
      isbn: publication.isbn || "",
      publisher: publication.publisher || "",
      journal: publication.journal || "",
      volume: publication.volume || "",
      issue: publication.issue || "",
      price: publication.price || "",
      currency: publication.currency || "NGN",
      description: publication.description || "",
      tags:
        publication.tags && publication.tags.length > 0
          ? publication.tags
          : [""],
      language: publication.language || "English",
    });
    setEditingId(publication._id);
    setPreviewUrl(
      publication.coverImage
        ? getImageUrl(publication.coverImage)
        : ""
    );
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this publication?")) {
      try {
        await adminApi.delete(`/publications/admin/${id}`);
        fetchPublications();
      } catch (error) {
        setError("Failed to delete publication");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray.length > 0 ? newArray : [""],
    });
  };

  const updateArrayItem = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const submitData = new FormData();

    // Add all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "authors" || key === "keywords" || key === "tags") {
        submitData.append(
          key,
          JSON.stringify(formData[key].filter((item) => item.trim()))
        );
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Add files if selected
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      submitData.append("coverImage", fileInputRef.current.files[0]);
    }
    if (pdfInputRef.current && pdfInputRef.current.files[0]) {
      submitData.append("file", pdfInputRef.current.files[0]);
    }

    try {
      if (editingId) {
        await adminApi.put(`/publications/admin/${editingId}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await adminApi.post("/publications/admin", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchPublications();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save publication");
      console.error("Error saving publication:", error);
    }
  };

  return (
    <div className={styles.adminPublicationsPage}>
      <div className={styles.adminHeader}>
        <h1>Publications Management</h1>
        <button className={styles.createBtn} onClick={() => setShowForm(true)}>
          Add New Publication
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {showForm && (
        <div className={styles.publicationFormModal}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>{editingId ? "Edit Publication" : "Add New Publication"}</h2>
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
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Authors *</label>
                {formData.authors.map((author, index) => (
                  <div key={index} className={styles.arrayInput}>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) =>
                        updateArrayItem("authors", index, e.target.value)
                      }
                      placeholder={`Author ${index + 1}`}
                      required={index === 0}
                    />
                    {formData.authors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("authors", index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem("authors")}>
                  Add Author
                </button>
              </div>

              <div className={styles.formGroup}>
                <label>Abstract *</label>
                <textarea
                  value={formData.abstract}
                  onChange={(e) =>
                    setFormData({ ...formData, abstract: e.target.value })
                  }
                  required
                  rows="6"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="4"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Published Date *</label>
                  <input
                    type="date"
                    value={formData.publishedDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        publishedDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>DOI</label>
                  <input
                    type="text"
                    value={formData.doi}
                    onChange={(e) =>
                      setFormData({ ...formData, doi: e.target.value })
                    }
                    placeholder="10.1234/example"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) =>
                      setFormData({ ...formData, isbn: e.target.value })
                    }
                    placeholder="978-3-16-148410-0"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) =>
                      setFormData({ ...formData, publisher: e.target.value })
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Journal</label>
                  <input
                    type="text"
                    value={formData.journal}
                    onChange={(e) =>
                      setFormData({ ...formData, journal: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Volume</label>
                  <input
                    type="text"
                    value={formData.volume}
                    onChange={(e) =>
                      setFormData({ ...formData, volume: e.target.value })
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Issue</label>
                  <input
                    type="text"
                    value={formData.issue}
                    onChange={(e) =>
                      setFormData({ ...formData, issue: e.target.value })
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Pages</label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) =>
                      setFormData({ ...formData, pages: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Price *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                    step="0.01"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                  >
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Language</label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
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
                      onChange={(e) =>
                        updateArrayItem("keywords", index, e.target.value)
                      }
                      placeholder={`Keyword ${index + 1}`}
                    />
                    {formData.keywords.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("keywords", index)}
                      >
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
                <label>Tags</label>
                {formData.tags.map((tag, index) => (
                  <div key={index} className={styles.arrayInput}>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) =>
                        updateArrayItem("tags", index, e.target.value)
                      }
                      placeholder={`Tag ${index + 1}`}
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("tags", index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem("tags")}>
                  Add Tag
                </button>
              </div>

              <div className={styles.formGroup}>
                <label>Cover Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                />
                {previewUrl && (
                  <div className={styles.imagePreview}>
                    <img src={previewUrl || "/placeholder.svg"} alt="Preview" />
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>PDF File *</label>
                <input
                  type="file"
                  ref={pdfInputRef}
                  accept=".pdf"
                  required={!editingId}
                />
                <small>Upload the publication PDF file</small>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit">
                  {editingId ? "Update Publication" : "Add Publication"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.publicationsList}>
        <h2>All Publications ({publications.length})</h2>
        {loading ? (
          <div className={styles.loading}>Loading publications...</div>
        ) : !publications || publications.length === 0 ? (
          <div className={styles.noPublications}>No publications found</div>
        ) : (
          <div className={styles.publicationsGrid}>
            {publications.map((publication) => (
              <div key={publication._id} className={styles.publicationCard}>
                <div className={styles.publicationHeader}>
                  <h3>{publication.title}</h3>
                  <span className={`${styles.statusBadge} ${publication.isActive ? styles.active : styles.inactive}`}>
                    {publication.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                
                {publication.coverImage && (
                  <div className={styles.publicationImage}>
                    <img 
                      src={getImageUrl(publication.coverImage)} 
                      alt={publication.title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                )}
                
                <div className={styles.publicationDetails}>
                  <p><strong>Authors:</strong> {publication.authors ? publication.authors.join(", ") : "No authors"}</p>
                  <p><strong>Category:</strong> {publication.category || "Not specified"}</p>
                  <p><strong>Published:</strong> {publication.publishedDate ? formatDate(publication.publishedDate) : "Not specified"}</p>
                  <p><strong>Price:</strong> {formatCurrency(publication.price, publication.currency)}</p>
                  <p><strong>Downloads:</strong> {publication.downloadCount || 0}</p>
                  <p><strong>Purchases:</strong> {publication.purchaseCount || 0}</p>
                </div>
                <div className={styles.publicationActions}>
                  <button onClick={() => handleEdit(publication)}>Edit</button>
                  <button onClick={() => handleDelete(publication._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPublications;