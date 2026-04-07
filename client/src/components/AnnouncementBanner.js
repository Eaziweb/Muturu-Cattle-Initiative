"use client"

import { useState, useEffect } from "react"
import api from "../utils/api"
import "../styles/announcements.css"

const AnnouncementBanner = ({ targetAudience = "all", limit = 3 }) => {
  const [announcements, setAnnouncements] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState([])

  useEffect(() => {
    fetchAnnouncements()
    loadDismissedAnnouncements()
  }, [targetAudience])

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length)
      }, 5000) // Auto-rotate every 5 seconds

      return () => clearInterval(interval)
    }
  }, [announcements.length])

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get(`/announcements/public?audience=${targetAudience}&limit=${limit}`)
      setAnnouncements(response.data.announcements)
    } catch (error) {
      console.error("Error fetching announcements:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadDismissedAnnouncements = () => {
    const dismissed = JSON.parse(localStorage.getItem("dismissedAnnouncements") || "[]")
    setDismissedAnnouncements(dismissed)
  }

  const dismissAnnouncement = (announcementId) => {
    const newDismissed = [...dismissedAnnouncements, announcementId]
    setDismissedAnnouncements(newDismissed)
    localStorage.setItem("dismissedAnnouncements", JSON.stringify(newDismissed))

    // Remove from current announcements
    setAnnouncements((prev) => prev.filter((ann) => ann._id !== announcementId))

    // Adjust current index if needed
    if (currentIndex >= announcements.length - 1) {
      setCurrentIndex(0)
    }
  }

  const handleAnnouncementClick = async (announcementId) => {
    try {
      await api.post(`/announcements/${announcementId}/view`)
    } catch (error) {
      console.error("Error tracking announcement view:", error)
    }
  }

  if (loading || announcements.length === 0) {
    return null
  }

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter((ann) => !dismissedAnnouncements.includes(ann._id))

  if (visibleAnnouncements.length === 0) {
    return null
  }

  const currentAnnouncement = visibleAnnouncements[currentIndex % visibleAnnouncements.length]

  return (
    <div className={`announcement-banner ${currentAnnouncement.type} ${currentAnnouncement.priority}`}>
      <div className="announcement-content">
        <div className="announcement-icon">
          {currentAnnouncement.type === "urgent" && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {currentAnnouncement.type === "event" && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
          {currentAnnouncement.type === "update" && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {currentAnnouncement.type === "general" && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 6v6l4 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <div className="announcement-text">
          <h4 className="announcement-title">{currentAnnouncement.title}</h4>
          <p className="announcement-message">{currentAnnouncement.content}</p>
        </div>

        {currentAnnouncement.image && (
          <div className="announcement-image">
            <img src={currentAnnouncement.image || "/placeholder.svg"} alt={currentAnnouncement.title} />
          </div>
        )}
      </div>

      <div className="announcement-actions">
        {visibleAnnouncements.length > 1 && (
          <div className="announcement-indicators">
            {visibleAnnouncements.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}

        <button
          className="dismiss-btn"
          onClick={() => dismissAnnouncement(currentAnnouncement._id)}
          title="Dismiss announcement"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default AnnouncementBanner
