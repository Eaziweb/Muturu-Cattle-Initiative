"use client"

import { useState, useEffect } from "react"
import api from "../../utils/adminApi"
import styles from "../../styles/OverviewSection.module.css"

const OverviewSection = () => {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOverviewStats()
  }, [])

  const fetchOverviewStats = async () => {
    try {
      const [membersRes, donationsRes] = await Promise.all([
        api.get("/users/admin/members?limit=1"),
        api.get("/donations/admin/stats"),
      ])

      setStats({
        totalMembers: membersRes.data.total,
        totalDonations: donationsRes.data.totalDonations,
        totalRevenue: donationsRes.data.totalRevenue,
        monthlyRevenue: donationsRes.data.monthlyRevenue,
      })
    } catch (error) {
      console.error("Error fetching overview stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading overview...</p>
      </div>
    )
  }

  return (
    <div className={styles.overviewSection}>
      <h2>System Overview</h2>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Members</h3>
          <p className={styles.statNumber}>{stats.totalMembers || 0}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Donations</h3>
        </div>
        <div className={styles.statCard}>
          <h3>Total Revenue</h3>
          <p className={styles.statNumber}>{formatCurrency(stats.totalRevenue || 0)}</p>
        </div>
        <div className={styles.statCard}>
          <h3>This Month</h3>
          <p className={styles.statNumber}>
            {stats.monthlyRevenue && stats.monthlyRevenue[0]
              ? formatCurrency(stats.monthlyRevenue[0].total)
              : formatCurrency(0)}
          </p>
        </div>
      </div>

      <div className={styles.quickLinks}>
        <div className={styles.quickLink}>
          <a href="/admin/events">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Events</span>
          </a>
        </div>
        <div className={styles.quickLink}>
          <a href="/admin/gallery">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>Gallery</span>
          </a>
        </div>
        <div className={styles.quickLink}>
          <a href="/admin/journals">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span>Journals</span>
          </a>
        </div>
        <div className={styles.quickLink}>
          <a href="/admin/publications">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span>Publications</span>
          </a>
        </div>
        <div className={styles.quickLink}>
          <a href="/admin/revenue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span>Revenue</span>
          </a>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h3>Recent Monthly Revenue</h3>
        <div className={styles.revenueChart}>
          {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
            stats.monthlyRevenue.slice(0, 6).map((month, index) => (
              <div key={index} className={styles.revenueItem}>
                <span className={styles.month}>
                  {new Date(month._id.year, month._id.month - 1).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </span>
                <span className={styles.amount}>{formatCurrency(month.total)}</span>
                <span className={styles.count}>({month.count} donations)</span>
              </div>
            ))
          ) : (
            <p>No revenue data available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default OverviewSection
