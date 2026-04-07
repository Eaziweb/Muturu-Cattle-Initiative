"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import "../../styles/members.css"
import Navbar from "../../components/NavBar"
import { FaSearch, FaTimes, FaUser, FaMapMarkerAlt, FaGraduationCap, FaFlask, FaCalendarAlt, FaBook, FaResearchgate, FaUserPlus, FaHandHoldingUsd } from "react-icons/fa"

const FindMembers = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalMembers, setTotalMembers] = useState(0)
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    profession: "",
  })
  const [countries, setCountries] = useState([])
  const [professions, setProfessions] = useState([])
  const [imageErrors, setImageErrors] = useState({}) // Track image loading errors

  // Function to get the full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Otherwise, prepend the API base URL
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return `${baseUrl}/${imagePath}`;
  }

  useEffect(() => {
    fetchMembers()
  }, [currentPage, filters])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 12,
        search: filters.search,
        country: filters.country,
        profession: filters.profession,
      })

      const response = await api.get(`/users/members?${queryParams}`)
      setMembers(response.data.users)
      setTotalPages(response.data.totalPages)
      setTotalMembers(response.data.total)

      // Extract unique countries and professions for filters
      if (currentPage === 1 && !filters.search && !filters.country && !filters.profession) {
        const uniqueCountries = [...new Set(response.data.users.map((member) => member.country))].sort()
        const uniqueProfessions = [...new Set(response.data.users.map((member) => member.profession))].sort()
        setCountries(uniqueCountries)
        setProfessions(uniqueProfessions)
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      country: "",
      profession: "",
    })
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const handleImageError = (memberId) => {
    setImageErrors(prev => ({ ...prev, [memberId]: true }))
  }

  return (
    <div className="member-section">
      <Navbar />
      
      {/* Hero Section */}
      <div className="members-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Find Members</h1>
            <p>Connect with researchers and practitioners in our agricultural network</p>
          </div>
          <div className="hero-stats">
            {/* <div className="stat-card">
              <div className="stat-number">{totalMembers}</div>
              <div className="stat-label">Total Members</div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="members-container">
        <div className="members-content">
          {/* Filters Section */}
          <div className="filters-section">
            <div className="filters-header">
              <h3><FaSearch className="icon" /> Filter Members</h3>
              <button onClick={clearFilters} className="clear-filters-btn">
                <FaTimes className="icon" /> Clear All
              </button>
            </div>

            <div className="filters-form">
              <div className="filter-group">
                <label htmlFor="search">Search by Name</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Enter member name..."
                    className="filter-input"
                  />
                  <FaSearch className="input-icon" />
                </div>
              </div>

              <div className="filter-group">
                <label htmlFor="country">Country</label>
                <select id="country" name="country" value={filters.country} onChange={handleFilterChange}>
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="profession">Profession</label>
                <select id="profession" name="profession" value={filters.profession} onChange={handleFilterChange}>
                  <option value="">All Professions</option>
                  {professions.map((profession) => (
                    <option key={profession} value={profession}>
                      {profession}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="active-filters">
              {(filters.search || filters.country || filters.profession) && (
                <div className="active-filters-list">
                  <span className="active-filters-label">Active filters:</span>
                  {filters.search && <span className="filter-tag">Name: {filters.search}</span>}
                  {filters.country && <span className="filter-tag">Country: {filters.country}</span>}
                  {filters.profession && <span className="filter-tag">Profession: {filters.profession}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Members Grid */}
          <div className="members-main">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading members...</p>
              </div>
            ) : members.length === 0 ? (
              <div className="no-members">
                <div className="no-members-icon">
                  <FaUser />
                </div>
                <h3>No members found</h3>
                <p>Try adjusting your search criteria or clear all filters to see all members.</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Show All Members
                </button>
              </div>
            ) : (
              <>
                <div className="members-grid">
                  {members.map((member) => (
                    <div key={member._id} className="member-card">
                      <div className="member-header">
                        <div className="member-avatar">
                          {member.profileImage && !imageErrors[member._id] ? (
                            <img 
                              src={getFullImageUrl(member.profileImage)} 
                              alt={member.fullName} 
                              className="member-avatar-img" 
                              onError={() => handleImageError(member._id)}
                            />
                          ) : (
                            <div className="avatar-initials">
                              {member.fullName
                                .split(" ")
                                .map((name) => name[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="member-basic-info">
                          <h3 className="member-name">
                            {member.title} {member.fullName}
                          </h3>
                          <p className="member-id">ID: {member.memberID}</p>
                        </div>
                      </div>

                      <div className="member-details">
                        <div className="detail-item">
                          <div className="detail-icon">
                            <FaGraduationCap />
                          </div>
                          <div className="detail-content">
                            <span className="detail-label">Profession:</span>
                            <span className="detail-value">{member.profession}</span>
                          </div>
                        </div>

                        <div className="detail-item">
                          <div className="detail-icon">
                            <FaMapMarkerAlt />
                          </div>
                          <div className="detail-content">
                            <span className="detail-label">Location:</span>
                            <span className="detail-value">
                              {member.state}, {member.country}
                            </span>
                          </div>
                        </div>

                        {member.academicQualifications && (
                          <div className="detail-item">
                            <div className="detail-icon">
                              <FaGraduationCap />
                            </div>
                            <div className="detail-content">
                              <span className="detail-label">Qualifications:</span>
                              <span className="detail-value">{member.academicQualifications}</span>
                            </div>
                          </div>
                        )}

                        {member.researchDisciplines && (
                          <div className="detail-item">
                            <div className="detail-icon">
                              <FaFlask />
                            </div>
                            <div className="detail-content">
                              <span className="detail-label">Research Areas:</span>
                              <span className="detail-value">{member.researchDisciplines}</span>
                            </div>
                          </div>
                        )}

                        <div className="detail-item">
                          <div className="detail-icon">
                            <FaCalendarAlt />
                          </div>
                          <div className="detail-content">
                            <span className="detail-label">Member Since:</span>
                            <span className="detail-value">{formatDate(member.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="member-links">
                        {member.googleScholarProfile && (
                          <a
                            href={member.googleScholarProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="profile-link google-scholar"
                          >
                            <FaBook className="link-icon" /> Google Scholar
                          </a>
                        )}
                        {member.researchGateProfile && (
                          <a
                            href={member.researchGateProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="profile-link research-gate"
                          >
                            <FaResearchgate className="link-icon" /> ResearchGate
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      Previous
                    </button>

                    <div className="pagination-numbers">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`pagination-number ${currentPage === pageNumber ? "active" : ""}`}
                          >
                            {pageNumber}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Next
                    </button>
                  </div>
                )}

                <div className="pagination-info">
                  <p>
                    Showing {(currentPage - 1) * 12 + 1} to {Math.min(currentPage * 12, totalMembers)} of {totalMembers}{" "}
                    members
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="members-footer">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-icon">
                <FaUserPlus />
              </div>
              <div className="footer-text">
                <h4>Join Our Network</h4>
                <p>Connect with agricultural researchers and practitioners from around the world.</p>
                <Link to="/register" className="join-btn">
                  Become a Member
                </Link>
              </div>
            </div>

            <div className="footer-section">
              <div className="footer-icon">
                <FaHandHoldingUsd />
              </div>
              <div className="footer-text">
                <h4>Support Our Mission</h4>
                <p>Help us advance sustainable agriculture and preserve indigenous livestock breeds.</p>
                <Link to="/donate" className="donate-btn">
                  Make a Donation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FindMembers