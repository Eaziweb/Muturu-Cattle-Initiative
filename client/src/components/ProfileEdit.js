"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../utils/userApi"
// Import icons if you have react-icons installed, otherwise remove/comment out
import { FaUpload, FaUser, FaLink, FaIdCard, FaGraduationCap, FaGlobe, FaFlask } from "react-icons/fa"

const ProfileEdit = ({ user }) => {
  const { updateUser, fetchCurrentUser } = useAuth()
  
  // State for form fields
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
    profileImage: "", // Stores the URL string
  })

  // State for the actual file object (for upload)
  const [imageFile, setImageFile] = useState(null)
  
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Pre-fill form when user data loads
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type/size if needed
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file.")
        return
      }

      setImageFile(file)
      
      // Create a preview URL immediately so the user sees the change
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result }))
      }
      reader.readAsDataURL(file)
      setError("") // Clear previous errors
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      let finalImageUrl = formData.profileImage

      // 1. Handle Image Upload if a new file is selected
      if (imageFile) {
        setUploadingImage(true)
        const imageFormData = new FormData()
        imageFormData.append("profileImage", imageFile)

        try {
          const uploadRes = await api.post("/users/profile-image", imageFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          // Update the image URL with the one returned from Cloudinary/Server
          finalImageUrl = uploadRes.data.profileImage
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr)
          setError("Image upload failed. Please try again.")
          setLoading(false)
          setUploadingImage(false)
          return
        } finally {
          setUploadingImage(false)
        }
      }

      // 2. Update Profile Text Data
      // We send the finalImageUrl (either the old one, or the new Cloudinary one)
      const payload = { ...formData, profileImage: finalImageUrl }
      
      const response = await api.put("/users/profile", payload)
      updateUser(response.data)
      
      setSuccess(true)
      
      // Refresh user data globally
      await fetchCurrentUser()
      
      // Reset image file state so we don't re-upload on next save unless changed again
      setImageFile(null)
      
    } catch (error) {
      console.error("Profile update error:", error)
      setError(error.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-edit-wrapper">
      <div className="profile-edit-container">
        <div className="edit-header">
          <h2>Edit Profile</h2>
          <p>Update your personal and professional information</p>
        </div>
        
        {success && (
          <div className="alert alert-success">
            Profile updated successfully!
          </div>
        )}
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="profile-edit-form">
          
          {/* Section 1: Profile Image */}
          <div className="profile-image-section">
            <div className="image-preview-container">
              {formData.profileImage ? (
                <img 
                  src={formData.profileImage} 
                  alt="Profile Preview" 
                  className="profile-image-preview" 
                />
              ) : (
                <div className="avatar-placeholder-circle">
                  {formData.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
              {uploadingImage && (
                <div className="uploading-overlay">
                  <span>Uploading...</span>
                </div>
              )}
            </div>

            <div className="image-upload-section">
              <label className="upload-label" htmlFor="profileImage">
                <FaUpload style={{marginRight: '8px'}} /> Change Photo
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <p className="upload-hint">Allowed: JPG, PNG, WEBP (Max 2MB)</p>
            </div>
          </div>
          
          {/* Section 2: Personal Information */}
          <div className="form-section-title">
            <FaUser /> Personal Information
          </div>
          <div className="edit-grid">
            <div className="form-group full-width">
              <label>Full Name <span className="required-asterisk">*</span></label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Dr. John Doe"
              />
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Prof, Dr, Mr."
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+123 456 7890"
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. Nigeria"
              />
            </div>
            
            <div className="form-group full-width">
              <label>State / Province</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Lagos"
              />
            </div>
          </div>

          {/* Section 3: Academic & Professional */}
          <div className="form-section-title">
            <FaGraduationCap /> Academic & Professional
          </div>
          <div className="edit-grid">
            <div className="form-group">
              <label>Profession</label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="e.g. Researcher, Lecturer"
              />
            </div>

            <div className="form-group full-width">
              <label>Academic Qualifications</label>
              <textarea
                name="academicQualifications"
                value={formData.academicQualifications}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. Ph.D. in Animal Science, M.Sc. in Genetics..."
              />
            </div>

            <div className="form-group full-width">
              <label>Research Disciplines</label>
              <textarea
                name="researchDisciplines"
                value={formData.researchDisciplines}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. Animal Breeding, Genetics, Sustainable Agriculture..."
              />
            </div>

            <div className="form-group full-width">
              <label>Professional Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Write a short biography about yourself..."
              />
            </div>
          </div>

          {/* Section 4: Social & Links */}
          <div className="form-section-title">
            <FaLink /> Social Profiles
          </div>
          <div className="edit-grid">
            <div className="form-group full-width">
              <label><FaGlobe /> Google Scholar Profile URL</label>
              <input
                type="url"
                name="googleScholarProfile"
                value={formData.googleScholarProfile}
                onChange={handleChange}
                placeholder="https://scholar.google.com/..."
              />
            </div>

            <div className="form-group full-width">
              <label><FaFlask /> ResearchGate Profile URL</label>
              <input
                type="url"
                name="researchGateProfile"
                value={formData.researchGateProfile}
                onChange={handleChange}
                placeholder="https://www.researchgate.net/profile/..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading || uploadingImage} className="save-btn">
              {loading || uploadingImage ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileEdit