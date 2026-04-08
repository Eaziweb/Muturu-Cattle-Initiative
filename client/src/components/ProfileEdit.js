import { useState } from "react"
import api from "../utils/userApi"
import { useAuth } from "../contexts/AuthContext"

const ProfileEdit = ({ user }) => {
  const { fetchCurrentUser } = useAuth()
  const [formData, setFormData] = useState({
    title: user?.title || "",
    academicQualifications: user?.academicQualifications || "",
    researchDisciplines: user?.researchDisciplines || "",
    googleScholarProfile: user?.googleScholarProfile || "",
    researchGateProfile: user?.researchGateProfile || "",
    bio: user?.bio || "",
    phoneNumber: user?.phoneNumber || "",
    gender: user?.gender || "",
  })
  const [status, setStatus] = useState({ type: "", msg: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: "", msg: "" })

    try {
      await api.put("/users/profile", formData)
      await fetchCurrentUser() // Refresh global user state
      setStatus({ type: "success", msg: "Profile updated successfully!" })
    } catch (error) {
      setStatus({ type: "error", msg: error.response?.data?.message || "Update failed" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="profile-edit-form">
      <h2>Edit Professional Profile</h2>
      {status.msg && <div className={`status-alert ${status.type}`}>{status.msg}</div>}

      <form onSubmit={handleSubmit} className="edit-grid">
        <div className="form-group full-width">
          <label>Professional Bio</label>
          <textarea 
            name="bio" 
            value={formData.bio} 
            onChange={handleChange} 
            placeholder="Tell us about your research and experience..."
          />
        </div>

        <div className="form-group">
          <label>Academic Title (e.g. Prof, Dr, Mr)</label>
          <input name="title" value={formData.title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Academic Qualifications</label>
          <input 
            name="academicQualifications" 
            value={formData.academicQualifications} 
            onChange={handleChange} 
            placeholder="BSc, MSc, PhD..." 
          />
        </div>

        <div className="form-group">
          <label>Research Disciplines</label>
          <input 
            name="researchDisciplines" 
            value={formData.researchDisciplines} 
            onChange={handleChange} 
            placeholder="Genetics, Nutrition, etc."
          />
        </div>

        <div className="form-group">
          <label>Google Scholar URL</label>
          <input 
            name="googleScholarProfile" 
            value={formData.googleScholarProfile} 
            onChange={handleChange} 
            placeholder="https://scholar.google.com/..."
          />
        </div>

        <div className="form-group">
          <label>ResearchGate URL</label>
          <input 
            name="researchGateProfile" 
            value={formData.researchGateProfile} 
            onChange={handleChange} 
            placeholder="https://researchgate.net/profile/..."
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-actions full-width">
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            {isSubmitting ? "Saving Changes..." : "Save Profile Updates"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileEdit