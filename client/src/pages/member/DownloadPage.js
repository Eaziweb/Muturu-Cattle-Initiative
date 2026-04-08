// components/DownloadPage.js
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../../styles/DownloadPage.css"
import Navbar from "../../components/NavBar"
import userApi from "../../utils/userApi"
import { FaExclamationTriangle, FaCheckCircle, FaDownload, FaSpinner } from "react-icons/fa"

const DownloadPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [downloadInfo, setDownloadInfo] = useState(null)
  const [error, setError] = useState("")
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      setLoading(true)
      console.log("Verifying token:", token)
      
      // Use userApi instead of direct axios
      const response = await userApi.get(`/downloads/verify/${token}`)
      console.log("Verification response:", response.data)

      if (response.data.valid) {
        setDownloadInfo(response.data.downloadInfo)
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      console.error("Verification error:", err)
      if (err.response) {
        console.error("Error response:", err.response.data)
        setError(err.response.data.message || "Failed to verify download link. Please try again.")
      } else {
        setError("Failed to verify download link. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      setDownloading(true)

      // Use userApi's base URL for the download link
      const downloadUrl = `${userApi.defaults.baseURL}/downloads/file/${token}`
      console.log("Downloading from:", downloadUrl)
      
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = downloadInfo.itemTitle + ".pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Refresh download info after successful download
      setTimeout(() => {
        verifyToken()
        setDownloading(false)
      }, 2000)
    } catch (err) {
      console.error("Download error:", err)
      setError("Failed to download file. Please try again.")
      setDownloading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="download-page">
        <div className="download-container">
          <div className="loadingSpinner">
            <FaSpinner className="spinner-icon" />
          </div>
          <p>Verifying your download link...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="download-page">
        <div className="download-container error-container">
          <div className="error-icon">
            <FaExclamationTriangle />
          </div>
          <h2>Download Link Invalid</h2>
          <p className="error-message">{error}</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="download-page">
      <div className="download-container">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        <h1>Your Download is Ready!</h1>

        <div className="download-info-card">
          <h2>{downloadInfo.itemTitle}</h2>
          {downloadInfo.authors && downloadInfo.authors.length > 0 && (
            <p className="authors">By {downloadInfo.authors.join(", ")}</p>
          )}

          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Type:</span>
              <span className="info-value">{downloadInfo.itemType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">File Size:</span>
              <span className="info-value">{downloadInfo.fileSize}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Downloads Remaining:</span>
              <span className="info-value">
                {downloadInfo.downloadsRemaining} of {downloadInfo.maxDownloads}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Link Expires:</span>
              <span className="info-value">{formatDate(downloadInfo.expiresAt)}</span>
            </div>
          </div>

          <button 
            onClick={handleDownload} 
            disabled={downloading} 
            className="btn-download"
          >
            {downloading ? (
              <>
                <FaSpinner className="spinner-small" />
                Downloading...
              </>
            ) : (
              <>
                <FaDownload />
                Download Now
              </>
            )}
          </button>

          <div className="warning-box">
            <h3>Important Information:</h3>
            <ul>
              <li>This download link will expire on {formatDate(downloadInfo.expiresAt)}</li>
              <li>You can download this file up to {downloadInfo.maxDownloads} times</li>
              <li>Do not share this link with others</li>
              <li>If you experience any issues, please contact support</li>
            </ul>
          </div>
        </div>

        <button onClick={() => navigate("/")} className="btn-secondary">
          Return to Home
        </button>
      </div>
    </div>
  )
}

export default DownloadPage