// components/ProfileEdit.jsx
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../utils/userApi"

const ProfileEdit = ({ user }) => {
  const { updateUser, fetchCurrentUser } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    profession: "",
    academicQualifications: "",
    researchDisciplines: "",
    country: "",
    profileImage: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        title: user.title || "",
        profession: user.profession || "",
        academicQualifications: user.academicQualifications || "",
        researchDisciplines: user.researchDisciplines || "",
        country: user.country || "",
        profileImage: user.profileImage || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result }))
      }
      reader.readAsDataURL(file)
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
      
      // Fetch the latest user data from the server
      await fetchCurrentUser()
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-edit-container">
      <h2>Edit Profile</h2>
      
      {success && (
        <div className="success-message">
          Profile updated successfully!
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="profile-image-section">
          <div className="current-image">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Profile" className="profile-img-preview" />
            ) : (
              <div className="avatar-placeholder">
                {formData.fullName
                  ? formData.fullName
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase()
                  : "U"}
              </div>
            )}
          </div>
          <div className="image-upload">
            <label htmlFor="profileImage">Change Profile Picture</label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="profession">Profession</label>
          <input
            type="text"
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="academicQualifications">Academic Qualifications</label>
          <textarea
            id="academicQualifications"
            name="academicQualifications"
            value={formData.academicQualifications}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="researchDisciplines">Research Disciplines</label>
          <textarea
            id="researchDisciplines"
            name="researchDisciplines"
            value={formData.researchDisciplines}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileEdit