"use client"

import { useState, useEffect } from "react"
import api from "../../utils/api"
import userApi from "../../utils/userApi"
import "../../styles/Publications.css"
import Navbar from "../../components/NavBar"

const Publications = () => {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedPub, setSelectedPub] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const userToken = localStorage.getItem("token")
  const categories = ["Research Paper", "Conference Paper", "Book Chapter", "Thesis", "Report", "Other"]

  useEffect(() => {
    fetchPublications()
  }, [currentPage, searchTerm, categoryFilter])

  const fetchPublications = async () => {
    try {
      setLoading(true)
      const response = await api.get("/publications", {
        params: { page: currentPage, limit: 12, search: searchTerm, category: categoryFilter },
      })
      setPublications(response.data.publications)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      setError("Error fetching publications")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDetails = (pub) => {
    setSelectedPub(pub)
    setShowDetailsModal(true)
  }

  const handlePurchase = (pub) => {
    if (!userToken) {
      alert("Please login to purchase publications")
      window.location.href = "/login"
      return
    }
    setSelectedPub(pub)
    setShowDetailsModal(false)
    setShowPaymentModal(true)
  }

  const processPayment = async () => {
    try {
      setPaymentLoading(true)
      const response = await userApi.post("/payments/initialize", {
        itemType: "publication",
        itemId: selectedPub._id,
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
    <div className="publications-page">
      <Navbar />
      <div className="publications-hero">
        <h1>Academic Publications</h1>
        <p>Explore full-text research, conference papers, and technical reports</p>
      </div>

      <div className="publications-content">
        <div className="search-filter-row">
          <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); fetchPublications(); }} className="pub-search-bar">
            <input
              type="text"
              placeholder="Search by title, DOI, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="pub-category-select">
            <option value="all">All Document Types</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="pub-loading"><div className="loader-dot"></div><p>Loading Library...</p></div>
        ) : (
          <div className="pub-grid">
            {publications.map((pub) => (
              <div key={pub._id} className="pub-card">
                <div className="pub-card-img">
                  <img 
                    src={pub.coverImage || "https://via.placeholder.com/300x400?text=Academic+Paper"} 
                    alt={pub.title} 
                  />
                  <span className="pub-tag">{pub.category}</span>
                </div>
                <div className="pub-card-info">
                  <h3 className="pub-card-title">{pub.title}</h3>
                  <p className="pub-card-authors">{pub.authors.join(", ")}</p>
                  <div className="pub-card-meta">
                    <button className="info-trigger" onClick={() => handleOpenDetails(pub)}>View Abstract</button>
                    <span className="pub-card-price">{pub.currency} {pub.price}</span>
                  </div>
                  <button className="pub-buy-now" onClick={() => handlePurchase(pub)}>Purchase</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- PUBLICATION DETAILS MODAL --- */}
      {showDetailsModal && selectedPub && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="details-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowDetailsModal(false)}>&times;</button>
            <div className="details-modal-layout">
              <div className="details-modal-aside">
                <img src={selectedPub.coverImage || "https://via.placeholder.com/300x400?text=Paper"} alt="Cover" />
                <div className="aside-stats">
                  <p><strong>Pages:</strong> {selectedPub.pages || "N/A"}</p>
                  <p><strong>Date:</strong> {new Date(selectedPub.publishedDate).toLocaleDateString()}</p>
                  <p><strong>Lang:</strong> {selectedPub.language || "English"}</p>
                  {selectedPub.doi && <p className="doi-label"><strong>DOI:</strong> {selectedPub.doi}</p>}
                </div>
              </div>
              <div className="details-modal-main">
                <h2 className="modal-header-title">{selectedPub.title}</h2>
                <p className="modal-authors-list">By {selectedPub.authors.join(", ")}</p>
                
                <div className="modal-tags-container">
                    {selectedPub.keywords?.map(k => <span key={k} className="pub-keyword">{k}</span>)}
                </div>
                
                <div className="modal-section">
                  <h4>Abstract</h4>
                  <p className="modal-abstract-text">{selectedPub.abstract || selectedPub.description}</p>
                </div>

                <div className="modal-section">
                  <h4>Publication Details</h4>
                  <div className="metadata-table">
                    <div><strong>Publisher:</strong> {selectedPub.publisher || "MCI Press"}</div>
                    {selectedPub.journal && <div><strong>Journal:</strong> {selectedPub.journal}</div>}
                    {selectedPub.isbn && <div><strong>ISBN:</strong> {selectedPub.isbn}</div>}
                  </div>
                </div>

                <div className="modal-action-footer">
                    <span className="footer-price">{selectedPub.currency} {selectedPub.price}</span>
                    <button className="footer-buy-btn" onClick={() => handlePurchase(selectedPub)}>Buy Full Document</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      {showPaymentModal && selectedPub && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="simple-payment-card" onClick={(e) => e.stopPropagation()}>
            <h3>Secure Checkout</h3>
            <p>You are about to purchase: <strong>{selectedPub.title}</strong></p>
            <div className="total-box">Total: {selectedPub.currency} {selectedPub.price}</div>
            <div className="payment-buttons">
                <button className="cancel-pay" onClick={() => setShowPaymentModal(false)}>Go Back</button>
                <button className="confirm-pay" onClick={processPayment} disabled={paymentLoading}>
                    {paymentLoading ? "Connecting..." : "Pay with Flutterwave"}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Publications