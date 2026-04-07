"use client"

import { useState, useEffect } from "react"
import api from "../../utils/adminApi"
import styles from "../../styles/DonationsSection.module.css"
import { 
  FiDollarSign, 
  FiUser, 
  FiCalendar, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiAlertCircle,
  FiChevronLeft, 
  FiChevronRight,
  FiTrendingUp,
  FiPieChart,
  FiCreditCard
} from "react-icons/fi"

const DonationsSection = () => {
  const [donations, setDonations] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedDonation, setSelectedDonation] = useState(null)

  useEffect(() => {
    fetchDonations()
  }, [currentPage])

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const [donationsRes, statsRes] = await Promise.all([
        api.get(`/donations/admin/donations?page=${currentPage}`),
        api.get("/donations/admin/stats"),
      ])
      setDonations(donationsRes.data.donations)
      setTotalPages(donationsRes.data.totalPages)
      setStats(statsRes.data)
    } catch (error) {
      console.error("Error fetching donations:", error)
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FiCheckCircle className={styles.statusIcon} />
      case "failed":
        return <FiXCircle className={styles.statusIcon} />
      case "pending":
        return <FiClock className={styles.statusIcon} />
      default:
        return <FiAlertCircle className={styles.statusIcon} />
    }
  }

  return (
    <div className={styles.donationsSection}>
      <div className={styles.sectionHeader}>
        <h2>Donations Management</h2>
        <div className={styles.statsOverview}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FiPieChart />
            </div>
            <div className={styles.statContent}>
              <h3>Total Donations</h3>
              <p className={styles.statNumber}>{stats.totalDonations || 0}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FiTrendingUp />
            </div>
            <div className={styles.statContent}>
              <h3>Total Revenue</h3>
              <p className={styles.statNumber}>{formatCurrency(stats.totalRevenue || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading donations...</p>
        </div>
      ) : (
        <>
          <div className={styles.donationsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>Transaction ID</div>
              <div className={styles.headerCell}>Donor</div>
              <div className={styles.headerCell}>Amount</div>
              <div className={styles.headerCell}>Purpose</div>
              <div className={styles.headerCell}>Status</div>
              <div className={styles.headerCell}>Date</div>
            </div>
            {donations.map((donation) => (
              <div 
                key={donation._id} 
                className={styles.tableRow}
                onClick={() => setSelectedDonation(donation)}
              >
                <div className={styles.tableCell}>
                  <div className={styles.transactionId}>
                    <FiCreditCard className={styles.cellIcon} />
                    <span>{donation.transactionId}</span>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.donorInfo}>
                    <div className={styles.donorName}>
                      <FiUser className={styles.cellIcon} />
                      <span>{donation.anonymous ? "Anonymous" : donation.donorName}</span>
                    </div>
                    {donation.donorEmail && (
                      <div className={styles.donorEmail}>{donation.donorEmail}</div>
                    )}
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.amount}>
                    <FiDollarSign className={styles.cellIcon} />
                    <span>{formatCurrency(donation.amount)}</span>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.purpose}>{donation.purpose}</div>
                </div>
                <div className={styles.tableCell}>
                  <span className={`${styles.statusBadge} ${donation.status}`}>
                    {getStatusIcon(donation.status)}
                    {donation.status}
                  </span>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.dateInfo}>
                    <FiCalendar className={styles.cellIcon} />
                    <span>{formatDate(donation.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={styles.paginationBtn}
              >
                <FiChevronLeft />
                <span>Previous</span>
              </button>
              <span className={styles.paginationInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={styles.paginationBtn}
              >
                <span>Next</span>
                <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {selectedDonation && (
        <div className={styles.donationModal}>
          <div className={styles.donationModalContainer}>
            <div className={styles.modalHeader}>
              <h3>Donation Details</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedDonation(null)}>
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.detailSection}>
                <h4>Transaction Information</h4>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Transaction ID</div>
                    <div className={styles.detailValue}>
                      <FiCreditCard className={styles.detailIcon} />
                      {selectedDonation.transactionId}
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Amount</div>
                    <div className={styles.detailValue}>
                      <FiDollarSign className={styles.detailIcon} />
                      {formatCurrency(selectedDonation.amount)}
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Status</div>
                    <div className={styles.detailValue}>
                      <span className={`${styles.statusBadge} ${selectedDonation.status}`}>
                        {getStatusIcon(selectedDonation.status)}
                        {selectedDonation.status}
                      </span>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Date</div>
                    <div className={styles.detailValue}>
                      <FiCalendar className={styles.detailIcon} />
                      {formatDate(selectedDonation.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h4>Donor Information</h4>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Name</div>
                    <div className={styles.detailValue}>
                      <FiUser className={styles.detailIcon} />
                      {selectedDonation.anonymous ? "Anonymous" : selectedDonation.donorName}
                    </div>
                  </div>
                  {selectedDonation.donorEmail && (
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Email</div>
                      <div className={styles.detailValue}>{selectedDonation.donorEmail}</div>
                    </div>
                  )}
                  {selectedDonation.donorPhone && (
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Phone</div>
                      <div className={styles.detailValue}>{selectedDonation.donorPhone}</div>
                    </div>
                  )}
                  {selectedDonation.donorAddress && (
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Address</div>
                      <div className={styles.detailValue}>{selectedDonation.donorAddress}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.detailSection}>
                <h4>Additional Information</h4>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <div className={styles.detailLabel}>Purpose</div>
                    <div className={styles.detailValue}>{selectedDonation.purpose}</div>
                  </div>
                  {selectedDonation.message && (
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Message</div>
                      <div className={styles.detailValue}>{selectedDonation.message}</div>
                    </div>
                  )}
                  {selectedDonation.paymentMethod && (
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Payment Method</div>
                      <div className={styles.detailValue}>{selectedDonation.paymentMethod}</div>
                    </div>
                  )}
                  {selectedDonation.reference && (
                    <div className={styles.detailItem}>
                      <div className={styles.detailLabel}>Reference</div>
                      <div className={styles.detailValue}>{selectedDonation.reference}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DonationsSection