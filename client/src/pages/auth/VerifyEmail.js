"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import styles from "../../styles/VerifyEmail.module.css"
import Navbar from "../../components/NavBar"

const VerifyEmail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyEmail, resendCode } = useAuth()

  // Get email from registration state; fallback to empty string
  const [email, setEmail] = useState(location.state?.email || "")
  
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(0)

  // Redirect if no email is found (prevents landing on this page without context)
  useEffect(() => {
    if (!email) {
      setError("No email found. Please register or contact support.")
    }
  }, [email])

  // Resend Countdown Timer logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "") // Only allow numbers
    if (value.length <= 6) {
      setCode(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code.")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    const result = await verifyEmail(email, code)

    if (result.success) {
      setMessage("Account verified successfully! Redirecting to login...")
      setTimeout(() => navigate("/login"), 3000)
    } else {
      setError(result.message)
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) return

    setResending(true)
    setError("")
    setMessage("")

    const result = await resendCode(email)

    if (result.success) {
      setMessage("A new 6-digit code has been sent to your email.")
      setCountdown(60) // Disable resend for 60 seconds
    } else {
      setError(result.message)
    }
    setResending(false)
  }

  return (
    <div className={styles.verifyPage}>
      <Navbar />
      
      <div className={styles.verifyContainer}>
        <div className={styles.verifyHeader}>
          <button 
            className={styles.backButton} 
            onClick={() => navigate('/register')}
            aria-label="Back to registration"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1>Verify Your Email</h1>
          <p>We have sent a 6-digit verification code to:</p>
          <strong>{email || "your email address"}</strong>
        </div>

        <form onSubmit={handleSubmit} className={styles.verifyForm}>
          <div className={styles.codeInputContainer}>
            <label htmlFor="verificationCode">Enter 6-Digit Code</label>
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              value={code}
              onChange={handleInputChange}
              placeholder="000000"
              className={styles.codeInput}
              autoComplete="one-time-code"
              required
            />
          </div>

          {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}
          {message && <div className={`${styles.message} ${styles.success}`}>{message}</div>}

          <button 
            type="submit" 
            className={styles.verifyBtn} 
            disabled={loading || code.length !== 6}
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <div className={styles.resendSection}>
          <p>Didn't receive the code?</p>
          <button 
            className={styles.resendBtn} 
            onClick={handleResend}
            disabled={resending || countdown > 0 || !email}
          >
            {resending 
              ? "Sending..." 
              : countdown > 0 
                ? `Resend in ${countdown}s` 
                : "Resend Code"
            }
          </button>
        </div>

        <div className={styles.helpText}>
          <p>Check your spam folder if you don't see the email.</p>
          <p>Still having trouble? <Link to="/contact">Contact Support</Link></p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail