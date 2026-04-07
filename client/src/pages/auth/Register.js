"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import styles from "../../styles/Register.module.css"

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    academicQualifications: "",
    researchDisciplines: "",
    googleScholarProfile: "",
    researchGateProfile: "",
    email: "",
    phoneNumber: "",
    country: "",
    state: "",
    profession: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    if (!formData.country.trim()) newErrors.country = "Country is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.profession.trim()) newErrors.profession = "Profession is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => { 
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    const result = await register(formData)

    if (result.success) {
      setSuccess(
        `Registration successful! Member ID: ${result.memberID}. Please check your email to verify your account.`,
      )
      setFormData({
        fullName: "",
        title: "",
        academicQualifications: "",
        researchDisciplines: "",
        googleScholarProfile: "",
        researchGateProfile: "",
        email: "",
        phoneNumber: "",
        country: "",
        state: "",
        profession: "",
        password: "",
        confirmPassword: "",
      })
    } else {
      setErrors({ general: result.message })
    }

    setLoading(false)
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <button 
            className={styles.backButton} 
            onClick={() => navigate('/')}
            aria-label="Back to home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1>Join Our Research Network</h1>
          <p>Register to become a member of the Muturu Cattle Research Network</p>
        </div>

        {success && <div className={styles.successMessage}>{success}</div>}

        {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name(s) *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? styles.errorInput : ""}
                placeholder="Enter your full name"
              />
              {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="title">Title (Honorific)</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Dr., Prof., Mr., Mrs., etc."
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="academicQualifications">Academic Qualifications (Optional)</label>
            <input
              type="text"
              id="academicQualifications"
              name="academicQualifications"
              value={formData.academicQualifications}
              onChange={handleChange}
              placeholder="Ph.D., M.Sc., B.Sc., etc."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="researchDisciplines">Research Discipline(s) (Optional)</label>
            <input
              type="text"
              id="researchDisciplines"
              name="researchDisciplines"
              value={formData.researchDisciplines}
              onChange={handleChange}
              placeholder="Animal Genetics, Cattle Breeding, etc."
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="googleScholarProfile">Google Scholar Profile (Optional)</label>
              <input
                type="url"
                id="googleScholarProfile"
                name="googleScholarProfile"
                value={formData.googleScholarProfile}
                onChange={handleChange}
                placeholder="https://scholar.google.com/..."
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="researchGateProfile">ResearchGate Profile (Optional)</label>
              <input
                type="url"
                id="researchGateProfile"
                name="researchGateProfile"
                value={formData.researchGateProfile}
                onChange={handleChange}
                placeholder="https://www.researchgate.net/..."
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.errorInput : ""}
                placeholder="your.email@example.com"
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={errors.phoneNumber ? styles.errorInput : ""}
                placeholder="+234 123 456 7890"
              />
              {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="country">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={errors.country ? styles.errorInput : ""}
                placeholder="Nigeria"
              />
              {errors.country && <span className={styles.errorText}>{errors.country}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? styles.errorInput : ""}
                placeholder="Lagos"
              />
              {errors.state && <span className={styles.errorText}>{errors.state}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="profession">Profession *</label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className={errors.profession ? styles.errorInput : ""}
              placeholder="Researcher, Farmer, Academic, etc."
            />
            {errors.profession && <span className={styles.errorText}>{errors.profession}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password *</label>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? styles.errorInput : ""}
                  placeholder="Enter your password"
                />
                <button 
                  type="button" 
                  className={styles.passwordToggle} 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className={styles.passwordInput}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? styles.errorInput : ""}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className={styles.authButton} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>
            Already have an account? <Link to="/login" className={styles.authLink}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register