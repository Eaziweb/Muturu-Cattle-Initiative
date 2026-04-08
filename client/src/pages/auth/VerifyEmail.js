"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import styles from "../../styles/VerifyEmail.module.css"

const VerifyEmail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyEmail, resendCode } = useAuth()
  
  const email = location.state?.email || "" 
  
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(0) // Timer for resend button

  // Countdown logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (code.length !== 6) return setError("Please enter a 6-digit code")

    setLoading(true)
    setError("")
    setMessage("")
    
    const result = await verifyEmail(email, code)

    if (result.success) {
      setMessage("Verification Successful! Redirecting to login...")
      setTimeout(() => navigate("/login"), 3000)
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  const handleResend = async () => {
    if (!email) return setError("Email missing. Please register again.")
    
    setResending(true)
    setError("")
    setMessage("")

    const result = await resendCode(email)

    if (result.success) {
      setMessage(result.message)
      setCountdown(60) // Disable button for 60 seconds
    } else {
      setError(result.message)
    }
    setResending(false)
  }

  return (
    <div className={styles.verifyPage}>
      <div className={styles.verifyContainer}>
        <div className={styles.verifyHeader}>
          <h1>Verify Your Email</h1>
          <p>We've sent a 6-digit code to <strong>{email}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className={styles.verifyForm}>
          <div className={styles.codeInputContainer}>
            <label>Enter Verification Code</label>
            <input
              type="text"
              maxLength="6"
              className={styles.codeInput}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              required
            />
          </div>

          {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}
          {message && <div className={`${styles.message} ${styles.success}`}>{message}</div>}

          <button type="submit" className={styles.verifyBtn} disabled={loading}>
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <div className={styles.resendSection}>
          <p>Didn't receive the code?</p>
          <button 
            className={styles.resendBtn} 
            onClick={handleResend}
            disabled={resending || countdown > 0}
          >
            {resending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail