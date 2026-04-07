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
  const [selectedPublication, setSelectedPublication] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
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
        params: {
          page: currentPage,
          limit: 12,
          search: searchTerm,
          category: categoryFilter,
        },
      })
      setPublications(response.data.publications)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      setError("Error fetching publications")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = (publication) => {
    if (!userToken) {
      alert("Please login to purchase publications")
      window.location.href = "/login"
      return
    }
    setSelectedPublication(publication)
    setShowPaymentModal(true)
  }

  const processPayment = async () => {
    try {
      setPaymentLoading(true)
      const response = await userApi.post("/payments/initialize", {
        itemType: "publication",
        itemId: selectedPublication._id,
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
    fetchPublications()
  }

  if (loading && publications.length === 0) {
    return (
      <div className="publications-page">
        <div className="loading">Loading publications...</div>
      </div>
    )
  }

  return (
    <div className="publications-page">
            <Navbar/>
      <div className="publications-header">
        <h1>Academic Publications</h1>
        <p>Discover and access cutting-edge research publications</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search publications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="category-filter">
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Publications Grid */}
      <div className="publications-grid">
        {publications.map((publication) => (
          <div key={publication._id} className="publication-card">
            <div className="publication-image">
              {publication.coverImage ? (
                <img
                  src={publication.coverImage}
                  alt={publication.title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x400?text=No+Cover"
                  }}
                />
              ) : (
                <div className="no-cover-image">
                  <div className="no-cover-text">No Cover</div>
                </div>
              )}
            </div>

            <div className="publication-content">
              <div className="publication-category">{publication.category}</div>
              <h3 className="publication-title">{publication.title}</h3>
              <div className="publication-authors">By: {publication.authors.join(", ")}</div>
              <div className="publication-meta">
                <span>Published: {new Date(publication.publishedDate).toLocaleDateString()}</span>
                {publication.pages && <span>{publication.pages} pages</span>}
              </div>
              <p className="publication-abstract">{publication.abstract.substring(0, 150)}...</p>
              <div className="publication-footer">
                <div className="publication-price">
                  {publication.currency} {publication.price}
                </div>
                <button className="purchase-btn" onClick={() => handlePurchase(publication)}>
                  Purchase & Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <div className="modal-header">
              <h3>Purchase Publication</h3>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <h4>{selectedPublication.title}</h4>
              <p>Authors: {selectedPublication.authors.join(", ")}</p>
              <div className="payment-details">
                <div className="price-display">
                  <span className="price-label">Total Amount:</span>
                  <span className="price-amount">
                    {selectedPublication.currency} {selectedPublication.price}
                  </span>
                </div>
                <div className="payment-info">
                  <p>• Secure payment via Flutterwave</p>
                  <p>• Download link valid for 24 hours</p>
                  <p>• Up to 3 downloads allowed</p>
                  <p>• Confirmation email will be sent</p>
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

export default Publications