"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAdminAuth } from "../../contexts/AdminAuthContext"
import Navbar from "../../components/NavBar"

import api from "../../utils/adminApi"
import { 
  MdPeople, 
  MdPayments, 
  MdMenuBook, 
  MdArticle, 
  MdEvent, 
  MdCollections, 
  MdAccountBalance, 
  MdHandshake, 
  MdGroups, 
  MdCampaign, 
  MdNotifications, 
  MdContactMail,
  MdLogout,
  MdSettings,
  MdNotificationsActive,
  MdArrowForward,
  MdErrorOutline,
  MdHome,
  MdSearch
} from "react-icons/md"
import styles from "../../styles/AdminDashboard.module.css"

const AdminDashboard = () => {
  const { admin, logout, isAuthenticated } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})

  useEffect(() => {
    if (!isAuthenticated || !admin) {
      navigate("/admin/login", { replace: true })
      return
    }

    if (admin.role !== "admin") {
      navigate("/dashboard", { replace: true })
      return
    }

    fetchOverviewStats()
    setLoading(false)
  }, [admin, isAuthenticated, navigate])

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
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/admin/login", { replace: true })
  }

  const getInitials = (name) => {
    if (!name) return "AD"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const adminPages = [
    {
      id: "members",
      title: "Members",
      icon: <MdPeople />,
      link: "/admin/members",
      count: stats.totalMembers || 0
    },
    {
      id: "donations",
      title: "Donations",
      icon: <MdPayments />,
      link: "/admin/donations",
      count: stats.totalDonations || 0
    },
    {
      id: "publications",
      title: "Publications",
      icon: <MdMenuBook />,
      link: "/admin/publications"
    },
    {
      id: "journals",
      title: "Journals",
      icon: <MdMenuBook />,
      link: "/admin/journals"
    },
    {
      id: "blogs",
      title: "Blogs",
      icon: <MdArticle />,
      link: "/admin/blogs"
    },
    {
      id: "events",
      title: "Events",
      icon: <MdEvent />,
      link: "/admin/events"
    },
    {
      id: "gallery",
      title: "Gallery",
      icon: <MdCollections />,
      link: "/admin/gallery"
    },
    {
      id: "revenue",
      title: "Revenue",
      icon: <MdAccountBalance />,
      link: "/admin/revenue"
    },
    {
      id: "partnership",
      title: "Partnership",
      icon: <MdHandshake />,
      link: "/admin/partnership"
    },
    {
      id: "partners",
      title: "Partners",
      icon: <MdGroups />,
      link: "/admin/partners"
    },
    {
      id: "announcements",
      title: "Announcements",
      icon: <MdCampaign />,
      link: "/admin/announcements"
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <MdNotifications />,
      link: "/admin/notifications"
    },
    {
      id: "contacts",
      title: "Contacts",
      icon: <MdContactMail />,
      link: "/admin/contacts"
    }
  ]

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading Dashboard...</p>
      </div>
    )
  }

  if (!admin) {
    return (
      <div className={styles.errorContainer}>
        <MdErrorOutline className={styles.errorIcon} />
        <h2>Access Denied</h2>
        <p>Unable to load admin data. Please login again.</p>
        <button onClick={() => navigate("/admin/login")}>Return to Login</button>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
            <Navbar />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.brandLogo}>
            <div className={styles.logoIcon}>M</div>
            <div className={styles.brandText}>
              <h2>MCNI</h2>
              <span>Admin Portal</span>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.adminInfo}>
            <div className={styles.adminAvatar}>
              {admin?.profileImage ? (
                <img src={admin.profileImage || "/placeholder.svg"} alt={admin.fullName} />
              ) : (
                <div className={styles.avatarInitials}>{getInitials(admin.fullName)}</div>
              )}
              <div className={styles.statusDot}></div>
            </div>
            <div className={styles.adminDetails}>
              <h3>{admin.fullName || "Admin User"}</h3>
              <span className={styles.adminRole}>Administrator</span>
            </div>
          </div>
          <button className={styles.headerButton}>
            <MdNotificationsActive />
            <span className={styles.badge}>5</span>
          </button>
          <button className={styles.headerButton}>
            <MdSettings />
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <MdLogout />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentArea}>
          <h1 className={styles.pageTitle}>Admin Dashboard</h1>
          
          {/* Stats Overview */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Members</h3>
              <p className={styles.statNumber}>{stats.totalMembers || 0}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Total Donations</h3>
              <p className={styles.statNumber}>{stats.totalDonations || 0}</p>
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

          {/* Admin Pages Grid */}
          <h2 className={styles.sectionTitle}>Admin Sections</h2>
          <div className={styles.adminPagesGrid}>
            {adminPages.map((page) => (
              <a key={page.id} href={page.link} className={styles.adminPageCard}>
                <div className={styles.cardIcon}>
                  {page.icon}
                </div>
                <div className={styles.cardContent}>
                  <h3>{page.title}</h3>
                  {page.count !== undefined && (
                    <div className={styles.cardCount}>{page.count} items</div>
                  )}
                </div>
                <div className={styles.cardArrow}>
                  <MdArrowForward />
                </div>
              </a>
            ))}
          </div>

          {/* Recent Revenue */}
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
      </main>
    </div>
  )
}

export default AdminDashboard