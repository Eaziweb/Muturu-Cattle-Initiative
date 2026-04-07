"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import styles from "../../styles/ForgotPassword.module.css"
import Navbar from "../../components/NavBar"

const ForgotPassword = () => {
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    const result = await forgotPassword(email)

    if (result.success) {
      setMessage(result.message)
      setEmail("")
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
           <button 
            className={styles.backButton} 
            onClick={() => navigate('/login')}
            aria-label="Back to home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1>Reset Your Password</h1>
          <p>Enter your email address and we'll send you a link to reset your password</p>
        </div>

        {message && <div className={styles.successMessage}>{message}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error ? styles.errorInput : ""}
              placeholder="your.email@example.com"
            />
          </div>

          <button type="submit" className={styles.authButton} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>
            Remember your password? <Link to="/login" className={styles.authLink}>Sign in here</Link>
          </p>
          <p>
            Don't have an account? <Link to="/register" className={styles.authLink}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword