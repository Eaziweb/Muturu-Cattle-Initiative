"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import styles from "../../styles/VerifyEmail.module.css"
import Navbar from "../../components/NavBar"

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const { verifyEmail } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const token = searchParams.get("token")

  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setError("Invalid verification link")
        setLoading(false)
        return
      }

      const result = await verifyEmail(token)

      if (result.success) {
        setMessage(result.message)
      } else {
        setError(result.message)
      }

      setLoading(false)
    }

    handleVerification()
  }, [token, verifyEmail])

  return (
    <div className={styles.authContainer}>
            <Navbar />

      <div className={styles.authCard}>
        <div className={styles.authHeader}>
           <button 
            className={styles.backButton} 
            onClick={() => navigate('/register')}
            aria-label="Back to home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1>Email Verification</h1>
        </div>

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Verifying your email...</p>
          </div>
        )}

        {message && (
          <>
            <div className={styles.successMessage}>{message}</div>
            <div className={styles.verificationSuccess}>
              <h3>🎉 Welcome to Muturu Cattle Research Network!</h3>
              <p>Your account has been successfully verified. You can now access all member benefits.</p>
            </div>
          </>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}

        {!loading && (
          <div className={styles.authFooter}>
            <p>
              <Link to="/login" className={styles.authButton}>
                Continue to Login
              </Link>
            </p>
            <p>
              Need help? <Link to="/contact" className={styles.authLink}>Contact Support</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail