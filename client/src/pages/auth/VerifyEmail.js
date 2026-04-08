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

  const emailFromState = location.state?.email?.toLowerCase().trim() || ""
  const [email, setEmail] = useState(emailFromState)
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [verified, setVerified] = useState(false)

  // If no email in state, redirect back to register
  useEffect(() => {
    if (!emailFromState) {
      navigate("/register", { replace: true })
    }
  }, [emailFromState, navigate])

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleCodeChange = (e) => {
    // Only allow digits, max 6
    const val = e.target.value.replace(/\D/g, "").slice(0, 6)
    setCode(val)
    setError("") // clear error as user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError("Session expired. Please register again.")
      return
    }
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code.")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    const result = await verifyEmail(email, code)

    if (result.success) {
      setVerified(true)
      setMessage("Email verified successfully! Redirecting to login...")
      setTimeout(() => navigate("/login", { replace: true }), 2500)
    } else {
      setError(result.message || "Verification failed. Please check the code and try again.")
      setCode("") // clear the wrong code so user retypes
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError("Cannot resend: email address is missing.")
      return
    }
    if (countdown > 0) return

    setResending(true)
    setError("")
    setMessage("")

    const result = await resendCode(email)

    if (result.success) {
      setMessage("A new 6-digit code has been sent to your email.")
      setCountdown(60)
      setCode("") // clear old code
    } else {
      setError(result.message || "Failed to resend code. Please try again.")
    }
    setResending(false)
  }

  // Don't render if no email (useEffect will redirect)
  if (!emailFromState) return null

  return (
    <div className={styles.verifyPage}>
      <Navbar />
      <div className={styles.verifyContainer}>
        <div className={styles.verifyHeader}>
          <h1>Verify Your Account</h1>
          <p>Enter the 6-digit code sent to:</p>
          <strong className={styles.emailDisplay}>{email}</strong>
        </div>

        <form onSubmit={handleSubmit} className={styles.verifyForm}>
          <div className={styles.codeInputContainer}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={handleCodeChange}
              placeholder="000000"
              className={styles.codeInput}
              disabled={loading || verified}
              autoFocus
            />
          </div>

          {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}
          {message && <div className={`${styles.message} ${styles.success}`}>{message}</div>}

          <button
            type="submit"
            className={styles.verifyBtn}
            disabled={loading || verified || code.length < 6}
          >
            {loading ? "Verifying..." : verified ? "Verified!" : "Verify Email"}
          </button>
        </form>

        <div className={styles.resendSection}>
          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "8px" }}>
            Didn't receive the code?
          </p>
          <button
            className={styles.resendBtn}
            onClick={handleResend}
            disabled={resending || countdown > 0 || verified}
            type="button"
          >
            {resending
              ? "Sending..."
              : countdown > 0
              ? `Resend in ${countdown}s`
              : "Resend Code"}
          </button>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            type="button"
            onClick={() => navigate("/register", { replace: true })}
            style={{
              background: "none",
              border: "none",
              color: "#144d1b",
              cursor: "pointer",
              fontSize: "0.9rem",
              textDecoration: "underline",
            }}
          >
            Wrong email? Go back to register
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail