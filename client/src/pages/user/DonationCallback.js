"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import api from "../../utils/api"
import "../../styles/donate.css"
import Navbar from "../../components/NavBar"
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa"

const DonationCallback = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState("processing")
  const [donationDetails, setDonationDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    verifyDonation()
  }, [])

  const verifyDonation = async () => {
    try {
      const pendingDonation = localStorage.getItem("pendingDonation")
      if (!pendingDonation) {
        setStatus("error")
        setLoading(false)
        return
      }

      const { transactionId } = JSON.parse(pendingDonation)
      const response = await api.post(`/donations/verify/${transactionId}`)

      if (response.data.status === "success") {
        const donationStatus = response.data.donation.status
        if (donationStatus === "successful") {
          setStatus("success")
          setDonationDetails(response.data.donation)
          localStorage.removeItem("pendingDonation")
        } else if (donationStatus === "pending") {
          localStorage.removeItem("pendingDonation")
          setStatus("pending")
        } else {
          setStatus(donationStatus)
          localStorage.removeItem("pendingDonation")
        }
      } else {
        setStatus("failed")
        localStorage.removeItem("pendingDonation")
      }
    } catch (error) {
      console.error("Verification error:", error)
      setStatus("failed")
      localStorage.removeItem("pendingDonation")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="callback-container">
        <div className="callback-card">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h2>Verifying your donation...</h2>
            <p>Please wait while we confirm your payment.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="callback-container">
      <Navbar />

      <div className="callback-card">
        {status === "success" && (
          <div className="success-content">
            <div className="success-icon">
              <FaCheckCircle />
            </div>
            <h1>Thank You for Your Donation!</h1>
            <p className="success-message">
              Your generous contribution has been successfully processed and will make a real difference in advancing
              Muturu cattle initiative and conservation.
            </p>

            {donationDetails && (
              <div className="donation-summary">
                <h3>Donation Summary</h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span className="label">Transaction ID:</span>
                    <span className="value">{donationDetails.transactionId}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Amount:</span>
                    <span className="value amount">{formatCurrency(donationDetails.amount)}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Purpose:</span>
                    <span className="value">{donationDetails.purpose}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Status:</span>
                    <span className="value status-success">Successful</span>
                  </div>
                </div>
              </div>
            )}

            <div className="next-steps">
              <h3>What happens next?</h3>
              <ul>
                <li>You will receive an email receipt shortly</li>
                <li>Your donation will be allocated to the specified purpose</li>
                <li>We'll keep you updated on the impact of your contribution</li>
                <li>You can track our progress through our member updates</li>
              </ul>
            </div>

            <div className="action-buttons">
              <Link to="/" className="btn btn-primary">
                Return to Home
              </Link>
              <Link to="/donate" className="btn btn-secondary">
                Make Another Donation
              </Link>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="error-content">
            <div className="error-icon">
              <FaTimesCircle />
            </div>
            <h1>Donation Failed</h1>
            <p className="error-message">
              Unfortunately, your donation could not be processed. This could be due to insufficient funds, network
              issues, or payment cancellation.
            </p>

            <div className="error-actions">
              <h3>What you can do:</h3>
              <ul>
                <li>Check your payment method and try again</li>
                <li>Ensure you have sufficient funds</li>
                <li>Contact your bank if the issue persists</li>
                <li>Reach out to our support team for assistance</li>
              </ul>
            </div>

            <div className="action-buttons">
              <Link to="/donate" className="btn btn-primary">
                Try Again
              </Link>
              <Link to="/" className="btn btn-secondary">
                Return to Home
              </Link>
            </div>
          </div>
        )}

        {status === "cancelled" && (
          <div className="cancelled-content">
            <div className="cancelled-icon">
              <FaExclamationTriangle />
            </div>
            <h1>Donation Cancelled</h1>
            <p className="cancelled-message">Your donation was cancelled. No charges have been made to your account.</p>

            <div className="action-buttons">
              <Link to="/donate" className="btn btn-primary">
                Try Again
              </Link>
              <Link to="/" className="btn btn-secondary">
                Return to Home
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="error-content">
            <div className="error-icon">
              <FaExclamationTriangle />
            </div>
            <h1>Verification Error</h1>
            <p className="error-message">
              We encountered an error while verifying your donation. Please contact our support team with your
              transaction details.
            </p>

            <div className="action-buttons">
              <Link to="/" className="btn btn-primary">
                Return to Home
              </Link>
              <a href="mailto:support@mcrn.org" className="btn btn-secondary">
                Contact Support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DonationCallback