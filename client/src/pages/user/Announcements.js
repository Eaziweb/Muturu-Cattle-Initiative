"use client"

import { useState, useEffect } from "react"
import api from "../../utils/api"
import "../../styles/announcements.module.css"
import Navbar from "../../components/NavBar"

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedType, setSelectedType] = useState("")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)

  useEffect(() => {
    fetchAnnouncements()
  }, [currentPage, selectedType])

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(selectedType && { type: selectedType }),
      })

      const response = await api.get(`/announcements/public?${params}`)

      if (response.data && response.data.announcements) {
        setAnnouncements(response.data.announcements)
        setTotalPages(response.data.totalPages || 1)
      } else if (Array.isArray(response.data)) {
        setAnnouncements(response.data)
        setTotalPages(1)
      } else {
        setAnnouncements([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error("Error fetching announcements:", error)
      setAnnouncements([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleAnnouncementClick = async (announcement) => {
    setSelectedAnnouncement(announcement)
    try {
      if (announcement._id) {
        await api.post(`/announcements/${announcement._id}/view`)

        setAnnouncements((prev) =>
          prev.map((a) => (a._id === announcement._id ? { ...a, views: (a.views || 0) + 1 } : a)),
        )

        setSelectedAnnouncement((prev) => ({
          ...prev,
          views: (prev.views || 0) + 1,
        }))
      }
    } catch (error) {
      console.error("Error tracking announcement view:", error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "urgent":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        )
      case "event":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
          </svg>
        )
      case "update":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" />
          </svg>
        )
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" />
          </svg>
        )
    }
  }

  if (loading && currentPage === 1) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading announcements...</p>
      </div>
    )
  }

  return (
    <div className="announcements-page">
             <Navbar />
      <div className="container">
        <div className="announcements-header">
          <h1>Announcements</h1>
          <p>Stay updated with the latest news and important information from our research community</p>
        </div>

        <div className="announcements-filters">
          <div className="filter-buttons">
            {["", "urgent", "event", "update", "general"].map((type) => (
              <button
                key={type || "all"}
                className={`filter-btn ${selectedType === type ? "active" : ""}`}
                onClick={() => {
                  setSelectedType(type)
                  setCurrentPage(1)
                }}
              >
                {type ? type.charAt(0).toUpperCase() + type.slice(1) : "All Announcements"}
              </button>
            ))}
          </div>
        </div>

        <div className="announcements-grid">
          {announcements.length > 0 ? (
            announcements.map((announcement) => {
              const content = announcement.content || ""
              return (
                <div
                  key={announcement._id}
                  className={`announcement-card ${announcement.type || ""} ${announcement.priority || ""}`}
                  onClick={() => handleAnnouncementClick(announcement)}
                >
                  <div className="card-header">
                    <div className="announcement-meta">
                      <div className="type-icon">{getTypeIcon(announcement.type)}</div>
                      <div className="type-info">
                        <span className="type-badge">{announcement.type}</span>
                        <span className="priority-badge">{announcement.priority}</span>
                      </div>
                    </div>
                    <span className="announcement-date">{formatDate(announcement.createdAt)}</span>
                  </div>

                  {announcement.image && (
                    <div className="card-image">
                      <img src={announcement.image || "/placeholder.svg"} alt={announcement.title} loading="lazy" />
                    </div>
                  )}

                  <div className="card-content">
                    <h3 className="announcement-title">{announcement.title}</h3>
                    <p className="announcement-excerpt">
                      {content.length > 150 ? `${content.substring(0, 150)}...` : content}
                    </p>
                  </div>

                  <div className="card-footer">
                    <span className="view-count">{announcement.views || 0} views</span>
                    {announcement.expiresAt && (
                      <span className="expires-at">Expires: {formatDate(announcement.expiresAt)}</span>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="no-announcements">
              <h3>No announcements found</h3>
              <p>There are currently no announcements matching your criteria.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}

        {selectedAnnouncement && (
          <div className="announcement-modal">
            <div className="modal-container">
              <div className="modal-header">
                <div className="modal-meta">
                  <div className="type-icon">{getTypeIcon(selectedAnnouncement.type)}</div>
                  <div className="modal-info">
                    <h2>{selectedAnnouncement.title}</h2>
                    <div className="modal-badges">
                      <span className="type-badge">{selectedAnnouncement.type}</span>
                      <span className="priority-badge">{selectedAnnouncement.priority}</span>
                      <span className="date-badge">{formatDate(selectedAnnouncement.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <button className="close-btn" onClick={() => setSelectedAnnouncement(null)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              </div>

              {selectedAnnouncement.image && (
                <div className="modal-image">
                  <img src={selectedAnnouncement.image || "/placeholder.svg"} alt={selectedAnnouncement.title} />
                </div>
              )}

              <div className="modal-content">
                <div className="announcement-content">
                  {(selectedAnnouncement.content || "").split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="modal-footer">
                  <div className="announcement-stats">
                    <span>{selectedAnnouncement.views || 0} views</span>
                    {selectedAnnouncement.expiresAt && (
                      <span>Expires: {formatDate(selectedAnnouncement.expiresAt)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Announcements
