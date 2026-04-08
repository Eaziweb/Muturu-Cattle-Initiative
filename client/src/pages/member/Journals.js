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
  const [showDetailsModal, setShowDetailsModal] = useState(false) // New state
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const userToken = localStorage.getItem("token")

  const categories = ["Veterinary Science", "Animal Genetics", "Livestock Management", "Animal Nutrition", "Breeding", "Conservation", "Agricultural Science", "Other"]

  useEffect(() => {
    fetchJournals()
  }, [currentPage, searchTerm, categoryFilter])

  const fetchJournals = async () => {
    try {
      setLoading(true)
      const response = await api.get("/journals", {
        params: { page: currentPage, limit: 12, search: searchTerm, category: categoryFilter },
      })
      setJournals(response.data.journals)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      setError("Error fetching journals")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDetails = (journal) => {
    setSelectedJournal(journal)
    setShowDetailsModal(true)
  }

  const handlePurchase = (journal) => {
    if (!userToken) {
      alert("Please login to purchase journals")
      window.location.href = "/login"
      return
    }
    setSelectedJournal(journal)
    setShowDetailsModal(false) // Close details if open
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

  return (
    <div className="journals-page">
      <Navbar />
      <div className="journals-hero">
        <h1>Academic Journals</h1>
        <p>Access peer-reviewed academic journals on Muturu cattle research and livestock development</p>
      </div>

      <div className="journals-content">
        <div className="search-filter-section">
          <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); fetchJournals(); }} className="search-form">
            <input
              type="text"
              placeholder="Search by title, author, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </form>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="category-filter">
            <option value="all">All Categories</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="loading-state"><div className="spinner"></div><p>Fetching Journals...</p></div>
        ) : (
          <div className="journals-grid">
            {journals.map((journal) => (
              <div key={journal._id} className="journal-card">
                <div className="journal-image">
                  <img 
                    src={journal.coverImage || "/images/journal-placeholder.jpg"} 
                    alt={journal.title} 
                    onError={(e) => e.target.src = "/images/journal-placeholder.jpg"}
                  />
                  <div className="journal-badge">{journal.category}</div>
                </div>
                <div className="journal-body">
                  <h3 className="journal-title">{journal.title}</h3>
                  <p className="journal-snippet">{journal.description.substring(0, 90)}...</p>
                  <div className="journal-actions-row">
                    <button className="view-details-btn" onClick={() => handleOpenDetails(journal)}>View Info</button>
                    <div className="journal-price-tag">{journal.currency} {journal.price}</div>
                  </div>
                  <button className="purchase-btn-main" onClick={() => handlePurchase(journal)}>Purchase Now</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination logic remains same */}
      </div>

      {/* --- DETAILS POPUP --- */}
      {showDetailsModal && selectedJournal && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-x" onClick={() => setShowDetailsModal(false)}>&times;</button>
            <div className="details-grid">
              <div className="details-sidebar">
                <img src={selectedJournal.coverImage || "/images/journal-placeholder.jpg"} alt="Cover" />
                <div className="sidebar-info">
                  <p><strong>ISSN:</strong> {selectedJournal.issn}</p>
                  <p><strong>Volume:</strong> {selectedJournal.volume}</p>
                  <p><strong>Issue:</strong> {selectedJournal.issue}</p>
                  {selectedJournal.impactFactor && <p className="if-score"><strong>Impact Factor:</strong> {selectedJournal.impactFactor}</p>}
                </div>
              </div>
              <div className="details-main">
                <h2 className="modal-title">{selectedJournal.title}</h2>
                <div className="modal-tags">
                    {selectedJournal.keywords?.map(k => <span key={k} className="keyword-tag">{k}</span>)}
                </div>
                
                <div className="info-section">
                  <h4>Abstract</h4>
                  <p>{selectedJournal.abstract || selectedJournal.description}</p>
                </div>

                <div className="info-section">
                  <h4>Metadata</h4>
                  <div className="meta-grid">
                    <div><span>Publisher:</span> {selectedJournal.publisher}</div>
                    <div><span>Language:</span> {selectedJournal.language || "English"}</div>
                    <div><span>Pages:</span> {selectedJournal.pages || "N/A"}</div>
                  </div>
                </div>

                <div className="modal-footer-btns">
                    <div className="modal-price">{selectedJournal.currency} {selectedJournal.price}</div>
                    <button className="modal-buy-btn" onClick={() => handlePurchase(selectedJournal)}>Proceed to Buy</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PAYMENT MODAL (Your existing code adapted for consistency) --- */}
      {showPaymentModal && selectedJournal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Purchase</h3>
            <p>You are purchasing: <strong>{selectedJournal.title}</strong></p>
            <div className="price-box">{selectedJournal.currency} {selectedJournal.price}</div>
            <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                <button className="pay-btn" onClick={processPayment} disabled={paymentLoading}>
                    {paymentLoading ? "Connecting..." : "Pay with Flutterwave"}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Journals