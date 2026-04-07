"use client"

import { useState, useEffect } from "react"
import api from "../../utils/adminApi"
import styles from "../../styles/ContactsSection.module.css"

const ContactsSection = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedContact, setSelectedContact] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [replyLoading, setReplyLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchContacts()
  }, [currentPage])

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/contact/admin/all?page=${currentPage}`)
      setContacts(response.data.contacts)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Error fetching contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (contactId, status) => {
    try {
      await api.put(`/contact/admin/${contactId}/status`, { status })
      setMessage("Status updated successfully!")
      fetchContacts()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setError("Failed to update status")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleReply = async (contactId) => {
    if (!replyText.trim()) return

    setReplyLoading(true)
    try {
      await api.post(`/contact/admin/${contactId}/reply`, { reply: replyText })
      setMessage("Reply sent successfully!")
      setSelectedContact(null)
      setReplyText("")
      fetchContacts()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setError("Failed to send reply")
      setTimeout(() => setError(""), 3000)
    } finally {
      setReplyLoading(false)
    }
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

  return (
    <div className={styles.contactsSection}>
      <div className={styles.sectionHeader}>
        <h2>Contact Messages</h2>
      </div>

      {message && <div className={styles.successMessage}>{message}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading contacts...</p>
        </div>
      ) : (
        <>
          <div className={styles.contactsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>Name & Email</div>
              <div className={styles.headerCell}>Subject</div>
              <div className={styles.headerCell}>Status</div>
              <div className={styles.headerCell}>Date</div>
              <div className={styles.headerCell}>Actions</div>
            </div>
            {contacts.map((contact) => (
              <div key={contact._id} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <div className={styles.contactInfo}>
                    <h4>{contact.name}</h4>
                    <p>{contact.email}</p>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <h4>{contact.subject}</h4>
                  <p className={styles.messagePreview}>{contact.message.substring(0, 100)}...</p>
                </div>
                <div className={styles.tableCell}>
                  <span className={`${styles.statusBadge} ${contact.status}`}>{contact.status}</span>
                </div>
                <div className={styles.tableCell}>{formatDate(contact.createdAt)}</div>
                <div className={styles.tableCell}>
                  <div className={styles.actionButtons}>
                    <button className={styles.viewBtn} onClick={() => setSelectedContact(contact)}>
                      View
                    </button>
                    {contact.status === "unread" && (
                      <button className={styles.markReadBtn} onClick={() => handleStatusUpdate(contact._id, "read")}>
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedContact && (
            <div className={styles.contactModal}>
              <div className={styles.contactModalContainer}>
                <div className={styles.modalHeader}>
                  <h3>Contact Message</h3>
                  <button className={styles.closeBtn} onClick={() => setSelectedContact(null)}>
                    ×
                  </button>
                </div>

                <div className={styles.contactDetails}>
                  <div className={styles.contactMeta}>
                    <p>
                      <strong>From:</strong> {selectedContact.name} ({selectedContact.email})
                    </p>
                    <p>
                      <strong>Subject:</strong> {selectedContact.subject}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(selectedContact.createdAt)}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`${styles.statusBadge} ${selectedContact.status}`}>
                        {selectedContact.status}
                      </span>
                    </p>
                  </div>

                  <div className={styles.messageContent}>
                    <h4>Message:</h4>
                    <p>{selectedContact.message}</p>
                  </div>

                  {selectedContact.adminReply && (
                    <div className={styles.adminReply}>
                      <h4>Your Reply:</h4>
                      <p>{selectedContact.adminReply}</p>
                      <small>Replied on: {formatDate(selectedContact.repliedAt)}</small>
                    </div>
                  )}

                  <div className={styles.replySection}>
                    <h4>Send Reply:</h4>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      rows="4"
                    />
                    <div className={styles.replyActions}>
                      <button
                        className={styles.replyBtn}
                        onClick={() => handleReply(selectedContact._id)}
                        disabled={replyLoading || !replyText.trim()}
                      >
                        {replyLoading ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={styles.paginationBtn}
              >
                Previous
              </button>
              <span className={styles.paginationInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={styles.paginationBtn}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ContactsSection
