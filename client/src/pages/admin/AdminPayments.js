"use client"

import { useState, useEffect } from "react"
import adminApi from "../../utils/adminApi"
import styles from "../../styles/AdminPayments.module.css"

const AdminPayments = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPurchases: 0,
    avgTransactionValue: 0
  })
  const [revenueByType, setRevenueByType] = useState([])
  const [payments, setPayments] = useState([])
  const [topItems, setTopItems] = useState([])

  useEffect(() => {
    fetchPaymentData()
  }, [])

  const fetchPaymentData = async () => {
    try {
      setLoading(true)
      const response = await adminApi.get("/revenue/admin/payments")
      setStats(response.data.stats)
      setRevenueByType(response.data.revenueByType)
      setPayments(response.data.payments)
      setTopItems(response.data.topItems)
    } catch (error) {
      console.error("Error fetching payment data:", error)
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
      minute: "2-digit"
    })
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading payment data...</p>
      </div>
    )
  }

  return (
    <div className={styles.adminPaymentsPage}>
      <div className={styles.adminHeader}>
        <h1>Payment Dashboard</h1>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Revenue</h3>
          <p className={styles.statNumber}>{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Purchases</h3>
          <p className={styles.statNumber}>{stats.totalPurchases}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Avg. Transaction</h3>
          <p className={styles.statNumber}>{formatCurrency(stats.avgTransactionValue)}</p>
        </div>
      </div>

      <div className={styles.revenueByType}>
        <h2>Revenue by Type</h2>
        <div className={styles.revenueCards}>
          {revenueByType.map((item) => (
            <div key={item._id} className={styles.revenueCard}>
              <h3>{item._id.charAt(0).toUpperCase() + item._id.slice(1)}s</h3>
              <p className={styles.revenueAmount}>{formatCurrency(item.revenue)}</p>
              <p className={styles.revenueCount}>{item.count} purchases</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.paymentsSection}>
        <h2>Recent Payments</h2>
        <div className={styles.paymentsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Transaction ID</div>
            <div className={styles.headerCell}>User</div>
            <div className={styles.headerCell}>Item Type</div>
            <div className={styles.headerCell}>Item Details</div>
            <div className={styles.headerCell}>Amount</div>
            <div className={styles.headerCell}>Date</div>
          </div>
          {payments.map((payment) => (
            <div key={payment._id} className={styles.tableRow}>
              <div className={styles.tableCell}>{payment.transactionId}</div>
              <div className={styles.tableCell}>
                <div>{payment.user.fullName}</div>
                <div className={styles.userEmail}>{payment.user.email}</div>
              </div>
              <div className={styles.tableCell}>{payment.itemType}</div>
              <div className={styles.tableCell}>
                {payment.itemDetails ? (
                  <div>
                    <div className={styles.itemTitle}>{payment.itemDetails.title}</div>
                    {payment.itemType === 'publication' && payment.itemDetails.authors && (
                      <div className={styles.itemAuthors}>By: {payment.itemDetails.authors.join(', ')}</div>
                    )}
                    {payment.itemType === 'journal' && (
                      <div className={styles.itemJournalDetails}>
                        {payment.itemDetails.volume && `Vol: ${payment.itemDetails.volume}`} 
                        {payment.itemDetails.issue && `, Issue: ${payment.itemDetails.issue}`}
                      </div>
                    )}
                  </div>
                ) : (
                  <span>Item not found</span>
                )}
              </div>
              <div className={styles.tableCell}>{formatCurrency(payment.amount)}</div>
              <div className={styles.tableCell}>{formatDate(payment.createdAt)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.topItemsSection}>
        <h2>Top Selling Items</h2>
        <div className={styles.topItemsGrid}>
          {topItems.map((item, index) => (
            <div key={index} className={styles.topItemCard}>
              <div className={styles.itemRank}>#{index + 1}</div>
              <div className={styles.itemType}>{item._id.itemType}</div>
              {item.details && (
                <>
                  <div className={styles.itemTitle}>{item.details.title}</div>
                  {item._id.itemType === 'publication' && item.details.authors && (
                    <div className={styles.itemAuthors}>By: {item.details.authors.join(', ')}</div>
                  )}
                  {item._id.itemType === 'journal' && (
                    <div className={styles.itemJournalDetails}>
                      {item.details.volume && `Vol: ${item.details.volume}`} 
                      {item.details.issue && `, Issue: ${item.details.issue}`}
                    </div>
                  )}
                </>
              )}
              <div className={styles.itemRevenue}>{formatCurrency(item.revenue)}</div>
              <div className={styles.itemPurchases}>{item.purchases} purchases</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminPayments