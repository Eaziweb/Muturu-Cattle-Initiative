"use client"

import { useState, useEffect } from "react"
import api from "../../utils/api"
import userApi from "../../utils/userApi"
import "../../styles/Journals.css"
import Navbar from "../../components/NavBar"

const Journals = () => {
  const [journals, setJournals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedJournal, setSelectedJournal] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const userToken = localStorage.getItem("token")

  const categories = [
    "Veterinary Science",
    "Animal Genetics",
    "Livestock Management",
    "Animal Nutrition",
    "Breeding",
    "Conservation",
    "Agricultural Science",
    "Other",
  ]

  useEffect(() => {
    fetchJournals()
  }, [currentPage, searchTerm, categoryFilter])

  const fetchJournals = async () => {
    try {
      setLoading(true)
      const response = await api.get("/journals", {
        params: {
          page: currentPage,
          limit: 12,
          search: searchTerm,
          category: categoryFilter,
        },
      })
      setJournals(response.data.journals)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      setError("Error fetching journals")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = (journal) => {
    if (!userToken) {
      alert("Please login to purchase journals")
      window.location.href = "/login"
      return
    }
    setSelectedJournal(journal)
    setShowPaymentModal(true)
  }

  const processPayment = async () => {
    try {
      setPaymentLoading(true)
      const response = await userApi.post("/payments/initialize", {
        itemType: "journal",
        itemId: selectedJournal._id,
      })

      if (response.data.status === "success") {
        window.location.href = response.data.data.link
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error processing payment")
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchJournals()
  }

  if (loading && journals.length === 0) {
    return (
      <div className="journals-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading journals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="journals-page">
      <Navbar/>
      <div className="journals-hero">
        <h1>Academic Journals</h1>
        <p>Access peer-reviewed academic journals on Muturu cattle research and livestock development</p>
      </div>

      <div className="journals-content">
        <div className="search-filter-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search journals by title, author, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="journals-grid">
          {journals.map((journal) => (
            <div key={journal._id} className="journal-card">
              <div className="journal-image">
                {journal.coverImage ? (
                  <img
                    src={journal.coverImage || "/placeholder.svg"}
                    alt={journal.title}
                    onError={(e) => {
                      e.target.src = "/images/journal-placeholder.jpg"
                    }}
                  />
                ) : (
                  <div className="no-cover-image">
                    <span>📚</span>
                    <p>No Cover</p>
                  </div>
                )}
                <div className="journal-category-badge">{journal.category}</div>
              </div>

              <div className="journal-content">
                <h3 className="journal-title">{journal.title}</h3>
                <div className="journal-meta">
                  <span>ISSN: {journal.issn}</span>
                  <span>
                    Vol. {journal.volume}, Issue {journal.issue}
                  </span>
                </div>
                <div className="journal-editors">Editors: {journal.editors.join(", ")}</div>
                <div className="journal-publisher">Publisher: {journal.publisher}</div>
                {journal.impactFactor && <div className="impact-factor">Impact Factor: {journal.impactFactor}</div>}
                <p className="journal-description">{journal.description.substring(0, 120)}...</p>
                <div className="journal-footer">
                  <div className="journal-price">
                    {journal.currency} {journal.price}
                  </div>
                  <button className="purchase-btn" onClick={() => handlePurchase(journal)}>
                    Purchase & Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Purchase Journal</h3>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <h4>{selectedJournal.title}</h4>
              <p>
                Volume {selectedJournal.volume}, Issue {selectedJournal.issue}
              </p>
              <p>ISSN: {selectedJournal.issn}</p>
              <div className="payment-details">
                <div className="price-display">
                  <span className="price-label">Total Amount:</span>
                  <span className="price-amount">
                    {selectedJournal.currency} {selectedJournal.price}
                  </span>
                </div>
                <div className="payment-info">
                  <p>✓ Secure payment via Flutterwave</p>
                  <p>✓ Download link valid for 24 hours</p>
                  <p>✓ Up to 3 downloads allowed</p>
                  <p>✓ Confirmation email will be sent</p>
                </div>
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </button>
                <button className="pay-btn" onClick={processPayment} disabled={paymentLoading}>
                  {paymentLoading ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Journals
