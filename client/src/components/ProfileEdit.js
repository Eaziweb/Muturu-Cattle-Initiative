"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../utils/api" // Ensure this points to your axios instance

const ProfileEdit = ({ user }) => {
  const { updateUser, fetchCurrentUser } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    profession: "",
    academicQualifications: "",
    researchDisciplines: "",
    country: "",
    state: "",
    bio: "",
    phoneNumber: "",
    gender: "",
    googleScholarProfile: "",
    researchGateProfile: "",
    profileImage: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Load existing user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        title: user.title || "",
        profession: user.profession || "",
        academicQualifications: user.academicQualifications || "",
        researchDisciplines: user.researchDisciplines || "",
        country: user.country || "",
        state: user.state || "",
        bio: user.bio || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || "",
        googleScholarProfile: user.googleScholarProfile || "",
        researchGateProfile: user.researchGateProfile || "",
        profileImage: user.profileImage || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle specialized Image Upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const imageFormData = new FormData()
    imageFormData.append("profileImage", file)

    try {
      setLoading(true)
      // Use your existing specific image upload route
      const response = await api.post("/users/profile-image", imageFormData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setFormData(prev => ({ ...prev, profileImage: response.data.profileImage }))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Failed to upload image")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await api.put("/users/profile", formData)
      updateUser(response.data)
      setSuccess(true)
      await fetchCurrentUser() // Refresh context
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-edit-container">
      <h2 className="profile-edit-title">Update Professional Profile</h2>
      
      {success && <div className="status-alert success">Profile updated successfully!</div>}
      {error && <div className="status-alert error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="profile-edit-form">
        
        {/* Profile Image Section */}
        <div className="profile-image-section">
          <div className="image-preview-container">
            {formData.profileImage ? (
              <img 
                src={formData.profileImage.startsWith('http') ? formData.profileImage : `http://localhost:5000/${formData.profileImage}`} 
                alt="Profile" 
                className="profile-image-preview" 
              />
            ) : (
              <div className="avatar-placeholder-circle">{formData.fullName[0]}</div>
            )}
          </div>
          <div className="image-upload-section">
            <label className="upload-label">Profile Photo</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="file-input"
            />
            <p className="upload-hint">JPG, PNG or GIF. Max 2MB.</p>
          </div>
        </div>

        <div className="edit-grid">
          {/* Basic Info */}
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Title (e.g. Dr., Prof., Mr.)</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Profession</label>
            <input type="text" name="profession" value={formData.profession} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} />
          </div>

          {/* Biography */}
          <div className="form-group full-width">
            <label>Short Biography</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about your background..." />
          </div>

          {/* Academic Info */}
          <div className="form-group full-width">
            <label>Academic Qualifications</label>
            <textarea name="academicQualifications" value={formData.academicQualifications} onChange={handleChange} />
          </div>

          <div className="form-group full-width">
            <label>Research Disciplines</label>
            <textarea name="researchDisciplines" value={formData.researchDisciplines} onChange={handleChange} />
          </div>

          {/* Professional Links */}
          <div className="form-group">
            <label>Google Scholar URL</label>
            <input type="url" name="googleScholarProfile" value={formData.googleScholarProfile} onChange={handleChange} placeholder="https://scholar.google.com/..." />
          </div>

          <div className="form-group">
            <label>ResearchGate URL</label>
            <input type="url" name="researchGateProfile" value={formData.researchGateProfile} onChange={handleChange} placeholder="https://researchgate.net/profile/..." />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Processing..." : "Save Professional Profile"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileEdit