"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import styles from "../../styles/VerifyEmail.module.css"
import Navbar from "../../components/NavBar"

const VerifyEmail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyEmail, resendCode } = useAuth()

  // Grab email from navigation state
  const [email, setEmail] = useState(location.state?.email || "")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(0)

  // Handle countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError("Session expired. Please try registering again.")
      return
    }

    if (code.length !== 6) {
      setError("Please enter the full 6-digit code.")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    // Call the AuthContext function
    const result = await verifyEmail(email, code)

    if (result.success) {
      setMessage("Verification Successful! Redirecting to login...")
      setTimeout(() => navigate("/login"), 2500)
    } else {
      setError(result.message)
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError("Cannot resend: Email address is missing.")
      return
    }

    setResending(true)
    const result = await resendCode(email)

    if (result.success) {
      setMessage("A new code has been sent to your email.")
      setCountdown(60)
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
          <h1>Verify Your Account</h1>
          <p>Enter the 6-digit code sent to:</p>
          <strong className={styles.emailDisplay}>{email || "your email"}</strong>
        </div>

        <form onSubmit={handleSubmit} className={styles.verifyForm}>
          <div className={styles.codeInputContainer}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className={styles.codeInput}
              disabled={loading}
            />
          </div>

          {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}
          {message && <div className={`${styles.message} ${styles.success}`}>{message}</div>}

          <button type="submit" className={styles.verifyBtn} disabled={loading || code.length < 6}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className={styles.resendSection}>
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