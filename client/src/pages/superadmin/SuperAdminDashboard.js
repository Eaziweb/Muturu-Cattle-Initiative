"use client"

import { useState, useEffect } from "react"
import { useSuperAdminAuth } from "../../contexts/SuperAdminAuthContext"
import "../../styles/superadmin.css"
import Navbar from "../../components/NavBar"

const SuperAdminDashboard = () => {
  const { superAdmin, logout, createAdmin } = useSuperAdminAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [admins, setAdmins] = useState([])

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setMessage("")

    const result = await createAdmin(formData)

    if (result.success) {
      setMessage("Admin created successfully")
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "admin",
      })
      fetchAdmins()
    } else {
      setErrors({ general: result.message })
    }

    setLoading(false)
  }

  const handleLogout = () => {
    logout()
  }

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admin/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("superAdminToken")}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setAdmins(data.admins)
      }
    } catch (error) {
      console.error("Error fetching admins:", error)
    }
  }

  const deleteAdmin = async (adminId) => {
    try {
      const response = await fetch(`/api/admin/${adminId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("superAdminToken")}`,
        },
      })

      if (response.ok) {
        setMessage("Admin deleted successfully")
        fetchAdmins()
      } else {
        const data = await response.json()
        setErrors({ general: data.message })
      }
    } catch (error) {
      console.error("Error deleting admin:", error)
      setErrors({ general: "Failed to delete admin" })
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  return (
    <div className="superadmin-dashboard">
      <div className="superadmin-header">
        <div className="superadmin-title">
          <h1>Super Admin Dashboard</h1>
          <p>Manage administrator accounts</p>
        </div>
        <div className="superadmin-info">
          <span>Welcome, {superAdmin?.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="superadmin-content">
        <div className="create-admin-section">
          <h2>Create New Admin</h2>
          {message && <div className="success-message">{message}</div>}
          {errors.general && <div className="error-message">{errors.general}</div>}

          <form onSubmit={handleCreateAdmin} className="create-admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="create-btn">
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </form>
        </div>

        <div className="admins-list-section">
          <h2>Administrators</h2>
          <div className="admins-table-container">
            {admins.length === 0 ? (
              <p className="no-admins">No administrators found</p>
            ) : (
              <table className="admins-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((adminItem) => (
                    <tr key={adminItem._id}>
                      <td>{adminItem.username}</td>
                      <td>{adminItem.email}</td>
                      <td>
                        <span className={`role-badge ${adminItem.role}`}>
                          {adminItem.role === "super_admin" ? "Super Admin" : "Admin"}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${adminItem.isActive ? "active" : "inactive"}`}>
                          {adminItem.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{adminItem.lastLogin ? new Date(adminItem.lastLogin).toLocaleDateString() : "Never"}</td>
                      <td>
                        <div className="action-buttons">
                          {adminItem.role !== "super_admin" && (
                            <button onClick={() => deleteAdmin(adminItem._id)} className="delete-btn">
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
