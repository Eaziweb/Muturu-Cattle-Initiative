"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import styles from "../../styles/Login.module.css"
// import Navbar from "../../components/NavBar"
import { FaEye, FaEyeSlash } from "react-icons/fa"

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const from = location.state?.from?.pathname || "/dashboard"

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

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
      navigate(from, { replace: true })
    } else {
      setErrors({ general: result.message })
    }

    setLoading(false)
  }

  return (
    <div className="login">
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
            <h1>Welcome Back</h1>
            <p>Sign in to your Muturu Cattle Network Initiative</p>
          </div>

          {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
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
              <label htmlFor="password">Password</label>
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

            <div className={styles.formOptions}>
              <Link to="/forgot-password" className={styles.forgotPasswordLink}>
                Forgot your password?
              </Link>
            </div>

            <button type="submit" className={styles.authButton} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p>
              Don't have an account? <Link to="/register" className={styles.authLink}>Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login