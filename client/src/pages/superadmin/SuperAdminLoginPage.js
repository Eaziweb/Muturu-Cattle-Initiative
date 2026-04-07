"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useSuperAdminAuth } from "../../contexts/SuperAdminAuthContext"
import { EyeIcon, EyeOffIcon } from "../../components/Icons"
import "../../styles/auth.css"
import "../../styles/superadmin.css"
import Navbar from "../../components/NavBar"

const SuperAdminLoginPage = () => {
  const navigate = useNavigate()
  const { login } = useSuperAdminAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const superAdminEmail = process.env.REACT_APP_SUPERADMIN_EMAIL || "superadmin@example.com"
    setFormData((prev) => ({
      ...prev,
      email: superAdminEmail,
    }))
  }, [])

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

    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    const result = await login(formData.email, formData.password)

    if (result.success) {
      navigate("/superadmin/dashboard", { replace: true })
    } else {
      setErrors({ general: result.message })
    }

    setLoading(false)
  }

  return (
    <div className="auth-container superadmin-login">
      <div className="auth-card superadmin-card">
        <div className="auth-header superadmin-header">
          <h1>Super Admin Login</h1>
          <p>Sign in to your super admin account</p>
        </div>

        {errors.general && <div className="error-message">{errors.general}</div>}

        <form onSubmit={handleSubmit} className="auth-form superadmin-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              readOnly
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                placeholder="Enter your password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-button superadmin-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <Link to="/">Back to Home</Link> | <Link to="/admin/login">Regular Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminLoginPage
