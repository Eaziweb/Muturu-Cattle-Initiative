"use client"

import { useState, useEffect } from "react"
import adminApi from "../../utils/adminApi"
import styles from "../../styles/AdminPartnership.module.css"

const AdminPartnership = () => {
  const [partnerships, setPartnerships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedPartnership, setSelectedPartnership] = useState(null)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)

  useEffect(() => {
    fetchPartnerships()
  }, [page, statusFilter])

  const fetchPartnerships = async () => {
    try {
      setLoading(true)
      const params = { page }
      if (statusFilter) params.status = statusFilter
      
      const response = await adminApi.get("/partnership/admin/all", { params })
      setPartnerships(response.data.partnerships)
      setTotalPages(response.data.totalPages)
      setTotal(response.data.total)
      setError("")
    } catch (err) {
      setError("Failed to fetch partnership applications")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      setStatusUpdateLoading(true)
      await adminApi.put(`/partnership/admin/${id}/status`, { status: newStatus })
      setPartnerships(partnerships.map(p => 
        p._id === id ? { ...p, status: newStatus } : p
      ))
      if (selectedPartnership && selectedPartnership._id === id) {
        setSelectedPartnership({ ...selectedPartnership, status: newStatus })
      }
    } catch (err) {
      setError("Failed to update status")
      console.error(err)
    } finally {
      setStatusUpdateLoading(false)
    }
  }

  const viewPartnership = (partnership) => {
    setSelectedPartnership(partnership)
  }

  const closeDetails = () => {
    setSelectedPartnership(null)
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  return (
    <div className={styles.adminPage}>

      <div className={styles.container}>
        <div className={styles.adminHeader}>
          <h1>Partnership Applications</h1>
          <div className={styles.adminActions}>
            <div className={styles.filterGroup}>
              <label htmlFor="statusFilter">Filter by Status:</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <button onClick={fetchPartnerships} className={styles.refreshBtn}>
              Refresh
            </button>
          </div>
        </div>

        {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>Loading partnership applications...</div>
        ) : (
          <>
            <div className={styles.adminStats}>
              <div className={styles.statCard}>
                <h3>Total Applications</h3>
                <p>{total}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Pending</h3>
                <p>{partnerships.filter(p => p.status === 'pending').length}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Approved</h3>
                <p>{partnerships.filter(p => p.status === 'approved').length}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Rejected</h3>
                <p>{partnerships.filter(p => p.status === 'rejected').length}</p>
              </div>
            </div>

            <div className={styles.adminTableContainer}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Partnership Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partnerships.length > 0 ? (
                    partnerships.map((partnership) => (
                      <tr key={partnership._id}>
                        <td>{partnership.organizationName}</td>
                        <td>{partnership.contactPerson}</td>
                        <td>{partnership.email}</td>
                        <td>{partnership.partnershipType}</td>
                        <td>{new Date(partnership.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[partnership.status]}`}>
                            {partnership.status.charAt(0).toUpperCase() + partnership.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button 
                            onClick={() => viewPartnership(partnership)}
                            className={styles.viewBtn}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className={styles.noData}>
                        No partnership applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={styles.paginationBtn}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {page} of {totalPages}
                </span>
                <button 
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={styles.paginationBtn}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {selectedPartnership && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Partnership Application Details</h2>
                <button onClick={closeDetails} className={styles.closeBtn}>&times;</button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.detailGroup}>
                  <h3>Organization Information</h3>
                  <p><strong>Name:</strong> {selectedPartnership.organizationName}</p>
                  <p><strong>Type:</strong> {selectedPartnership.organizationType}</p>
                  <p><strong>Website:</strong> {selectedPartnership.website || "Not provided"}</p>
                </div>
                
                <div className={styles.detailGroup}>
                  <h3>Contact Information</h3>
                  <p><strong>Name:</strong> {selectedPartnership.contactPerson}</p>
                  <p><strong>Email:</strong> {selectedPartnership.email}</p>
                  <p><strong>Phone:</strong> {selectedPartnership.phone}</p>
                </div>
                
                <div className={styles.detailGroup}>
                  <h3>Partnership Details</h3>
                  <p><strong>Type:</strong> {selectedPartnership.partnershipType}</p>
                  <p><strong>Description:</strong> {selectedPartnership.description}</p>
                </div>
                
                <div className={styles.detailGroup}>
                  <h3>Application Status</h3>
                  <div className={styles.statusActions}>
                    <span className={`${styles.statusBadge} ${styles[selectedPartnership.status]}`}>
                      {selectedPartnership.status.charAt(0).toUpperCase() + selectedPartnership.status.slice(1)}
                    </span>
                    
                    <div className={styles.statusButtons}>
                      <button 
                        onClick={() => handleStatusChange(selectedPartnership._id, "pending")}
                        disabled={statusUpdateLoading || selectedPartnership.status === "pending"}
                        className={`${styles.statusBtn} ${styles.pending}`}
                      >
                        Mark as Pending
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedPartnership._id, "reviewed")}
                        disabled={statusUpdateLoading || selectedPartnership.status === "reviewed"}
                        className={`${styles.statusBtn} ${styles.reviewed}`}
                      >
                        Mark as Reviewed
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedPartnership._id, "approved")}
                        disabled={statusUpdateLoading || selectedPartnership.status === "approved"}
                        className={`${styles.statusBtn} ${styles.approved}`}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedPartnership._id, "rejected")}
                        disabled={statusUpdateLoading || selectedPartnership.status === "rejected"}
                        className={`${styles.statusBtn} ${styles.rejected}`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className={styles.detailGroup}>
                  <h3>Submission Information</h3>
                  <p><strong>Submitted:</strong> {new Date(selectedPartnership.createdAt).toLocaleString()}</p>
                  <p><strong>Last Updated:</strong> {new Date(selectedPartnership.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPartnership