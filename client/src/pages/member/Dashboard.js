// Dashboard.jsx
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../utils/userApi"
import ProfileEdit from "../../components/ProfileEdit"
import "../../styles/dashboard.css"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/NavBar"

const Dashboard = () => {
  const { user, logout, loading: authLoading, fetchCurrentUser } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const navigate = useNavigate()

  // Fetch user data and notifications when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest user data
        await fetchCurrentUser()
        
        // Fetch notifications
        const response = await api.get("/users/notifications")
        setNotifications(response.data)
        setUnreadCount(response.data.filter((n) => !n.isRead).length)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [fetchCurrentUser])

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await api.put(`/users/notifications/${notificationId}/read`)
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }, [])

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }, [])

  const stats = useMemo(
    () => [
      { title: "Member Since", value: formatDate(user?.createdAt) },
      { title: "Profile Status", value: "Verified", className: "status-verified" },
      { title: "Notifications", value: `${notifications.length} total` },
      { title: "Country", value: user?.country },
    ],
    [user, notifications.length, formatDate],
  )

  const profileDetails = useMemo(
    () => [
      { label: "Full Name", value: user?.fullName },
      { label: "Title", value: user?.title || "Not specified" },
      { label: "Email", value: user?.email },
      { label: "Profession", value: user?.profession },
      { label: "Academic Qualifications", value: user?.academicQualifications || "Not specified" },
      { label: "Research Disciplines", value: user?.researchDisciplines || "Not specified" },
    ],
    [user],
  )

  // Show loading spinner while auth or dashboard data is loading
  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    navigate("/login")
    return null
  }

  return (
    <div className="dashboard-container">
      <Navbar/>
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="user-info">
            <div className="user-avatar">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.fullName} className="profile-img" />
              ) : (
                <div className="avatar-placeholder">
                  {user?.fullName
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1>Welcome back, {user?.fullName}!</h1>
              <p className="member-id">Member ID: {user?.memberID}</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-nav">
          <button
            className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Edit Profile
          </button>
          <button
            className={`nav-item ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
        </div>

        <div className="dashboard-main">
          {activeTab === "overview" && (
            <div className="overview-section">
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <h3>{stat.title}</h3>
                    <p className={stat.className}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="profile-summary">
                <h2>Profile Summary</h2>
                <div className="profile-details">
                  {profileDetails.map((detail, index) => (
                    <div key={index} className="detail-row">
                      <span className="label">{detail.label}:</span>
                      <span className="value">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <button className="action-btn" onClick={() => setActiveTab("notifications")}>
                    View Notifications
                  </button>
                  <button className="action-btn" onClick={() => navigate("/donate")}>
                    Make Donation
                  </button>
                  <button className="action-btn" onClick={() => navigate("/publications")}>
                    Publications
                  </button>
                  <button className="action-btn" onClick={() => navigate("/journals")}>
                    Journals
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && <ProfileEdit user={user} />}

          {activeTab === "notifications" && (
            <div className="notifications-section">
              <h2>Notifications</h2>
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  <p>No notifications yet.</p>
                </div>
              ) : (
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.isRead ? "unread" : ""}`}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                    >
                      <div className="notification-header">
                        <h4>{notification.title}</h4>
                        <span className="notification-date">{formatDate(notification.createdAt)}</span>
                      </div>
                      <p className="notification-message">{notification.message}</p>
                      {notification.image && (
                        <div className="notification-image">
                          <img src={notification.image || "/placeholder.svg"} alt="Notification" />
                        </div>
                      )}
                      {!notification.isRead && <div className="unread-indicator"></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard