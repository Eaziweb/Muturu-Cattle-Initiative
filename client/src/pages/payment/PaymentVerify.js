"use client"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CheckIcon, XIcon, AlertIcon, LoaderIcon } from "../../components/Icons"
import userApi from "../../utils/userApi"
import "../../styles/payment.css"
import Navbar from "../../components/NavBar"

const PaymentVerify = () => {
  const [status, setStatus] = useState("verifying")
  const [message, setMessage] = useState("Verifying your payment...")
  const [downloadLink, setDownloadLink] = useState("")
  const [downloadToken, setDownloadToken] = useState("")
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const transactionId = searchParams.get("transaction_id")
        const txRef = searchParams.get("tx_ref")

        if (!transactionId && !txRef) {
          setStatus("error")
          setMessage("Invalid payment reference")
          return
        }

        console.log("Verifying payment with:", { transactionId, txRef })
        const response = await userApi.get(`/payments/verify/${transactionId || txRef}`)
        console.log("Payment verification response:", response.data)

        if (response.data.status === "success") {
          setStatus("success")
          setMessage("Payment verified successfully!")
          setDownloadLink(response.data.downloadLink)
          setDownloadToken(response.data.downloadToken)
          console.log("Download token set:", response.data.downloadToken)
        } else {
          setStatus("failed")
          setMessage("Payment verification failed")
        }
      } catch (error) {
        console.error("Payment verification error:", error)
        setStatus("error")
        setMessage(error.response?.data?.message || "Error verifying payment")
      }
    }

    verifyPayment()
  }, [searchParams])

  const handleDownloadClick = () => {
    if (!downloadToken) {
      console.error("No download token available")
      setStatus("error")
      setMessage("Download token not available. Please try again.")
      return
    }
    console.log("Navigating to download page with token:", downloadToken)
    navigate(`/download/${downloadToken}`)
  }

  return (
    <div className="payment-verify-container">
      <div className="payment-verify-card">
        <div className="status-icon-container">
          {status === "verifying" && <LoaderIcon className="status-icon verifying" />}
          {status === "success" && <CheckIcon className="status-icon success" />}
          {status === "failed" && <XIcon className="status-icon failed" />}
          {status === "error" && <AlertIcon className="status-icon error" />}
        </div>

        <h2 className="status-message">{message}</h2>

        {status === "success" && downloadToken && (
          <div className="download-section">
            <p>Your download link has been sent to your email.</p>
            <p>You can also download directly using the button below:</p>
            <button onClick={handleDownloadClick} className="download-btn">
              Go to Download Page
            </button>
          </div>
        )}

        <button onClick={() => navigate("/publications")} className="back-btn">
          Back to Publications
        </button>
      </div>
    </div>
  )
}

export default PaymentVerify