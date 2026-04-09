"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import "../../styles/members.module.css"
import Navbar from "../../components/NavBar"
import { 
  FaSearch, FaTimes, FaUser, FaMapMarkerAlt, FaGraduationCap, 
  FaFlask, FaCalendarAlt, FaBook, FaResearchgate, FaUserPlus, 
  FaHandHoldingUsd, FaChevronDown, FaFileAlt, FaGlobe, 
  FaUniversity, FaQuoteLeft, FaTwitter, FaLinkedin, FaEnvelope,
  FaFilter, FaArrowLeft, FaArrowRight, FaSpinner
} from "react-icons/fa"

const FindMembers = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalMembers, setTotalMembers] = useState(0)
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [loadingMemberDetails, setLoadingMemberDetails] = useState(false)

  // Mobile filters sidebar
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const [filters, setFilters] = useState({
    search: "",
    country: "",
    profession: "",
    sortBy: "newest"
  })
  const [countries, setCountries] = useState([])
  const [professions, setProfessions] = useState([])
  const [imageErrors, setImageErrors] = useState({})

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
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
        sort: filters.sortBy
      })

      const response = await api.get(`/users/members?${queryParams}`)
      let users = response.data.users || []

      if (filters.sortBy === "nameAsc") {
        users.sort((a, b) => a.fullName.localeCompare(b.fullName))
      } else if (filters.sortBy === "nameDesc") {
        users.sort((a, b) => b.fullName.localeCompare(a.fullName))
      }

      setMembers(users)
      setTotalPages(response.data.totalPages)
      setTotalMembers(response.data.total)

      if (currentPage === 1 && !filters.search && !filters.country && !filters.profession) {
        const uniqueCountries = [...new Set(users.map((m) => m.country))].filter(Boolean).sort()
        const uniqueProfessions = [...new Set(users.map((m) => m.profession))].filter(Boolean).sort()
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
    setFilters((prev) => ({ ...prev, [name]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({ search: "", country: "", profession: "", sortBy: "newest" })
    setCurrentPage(1)
    setShowMobileFilters(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const handleImageError = (memberId) => {
    setImageErrors(prev => ({ ...prev, [memberId]: true }))
  }

  const openModal = async (member) => {
    setSelectedMember(member)
    setIsModalOpen(true)
    setLoadingMemberDetails(true)

    try {
      const response = await api.get(`/users/${member._id}/details`)
      setSelectedMember(response.data)
    } catch (error) {
      console.error("Could not fetch extra details", error)
    } finally {
      setLoadingMemberDetails(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedMember(null)
  }

  const getInitials = (fullName) => {
    return fullName?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"
  }

  const hasActiveFilters = () => {
    return filters.search || filters.country || filters.profession || filters.sortBy !== "newest"
  }

  return (
    <div className="member-section">
      <Navbar />
      
      {/* Hero Section - Redesigned */}
      <div className="members-hero">
        <div className="hero-bg-pattern"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Research Community</h1>
            <p>Connect with agricultural experts, researchers, and practitioners from around the globe</p>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-number">{totalMembers.toLocaleString()}</span>
                <span className="stat-label">Researchers</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">{countries.length}</span>
                <span className="stat-label">Countries</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">{professions.length}</span>
                <span className="stat-label">Expertise Areas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="members-container">
        <div className="members-content">
          {/* Mobile Filter Toggle */}
          <div className="mobile-filter-toggle">
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <FaFilter /> Filters
              {hasActiveFilters() && <span className="filter-badge"></span>}
            </button>
            {hasActiveFilters() && (
              <button onClick={clearFilters} className="mobile-clear-btn">
                <FaTimes /> Clear
              </button>
            )}
          </div>

          {/* Filters Sidebar / Section */}
          <div className={`filters-section ${showMobileFilters ? 'mobile-open' : ''}`}>
            <div className="filters-header">
              <h3><FaSearch className="icon" /> Refine Search</h3>
              <div className="filter-actions">
                {hasActiveFilters() && (
                  <button onClick={clearFilters} className="clear-filters-btn">
                    <FaTimes /> Reset all
                  </button>
                )}
                {showMobileFilters && (
                  <button onClick={() => setShowMobileFilters(false)} className="close-filters-btn">
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div className="filters-grid">
              <div className="filter-group search-group">
                <div className="input-wrapper">
                  <FaSearch className="input-icon" />
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by name, expertise..."
                    className="custom-input"
                  />
                </div>
              </div>

              <div className="filter-group">
                <div className="select-wrapper">
                  <select 
                    name="sortBy" 
                    value={filters.sortBy} 
                    onChange={handleFilterChange}
                    className="custom-select"
                  >
                    <option value="newest">Newest first</option>
                    <option value="nameAsc">Name (A-Z)</option>
                    <option value="nameDesc">Name (Z-A)</option>
                  </select>
                  <FaChevronDown className="select-arrow" />
                </div>
              </div>

              <div className="filter-group">
                <div className="select-wrapper">
                  <select 
                    name="country" 
                    value={filters.country} 
                    onChange={handleFilterChange}
                    className="custom-select"
                  >
                    <option value="">All Countries</option>
                    {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <FaChevronDown className="select-arrow" />
                </div>
              </div>

              <div className="filter-group">
                <div className="select-wrapper">
                  <select 
                    name="profession" 
                    value={filters.profession} 
                    onChange={handleFilterChange}
                    className="custom-select"
                  >
                    <option value="">All Professions</option>
                    {professions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <FaChevronDown className="select-arrow" />
                </div>
              </div>
            </div>

            {/* Active Filter Tags */}
            {hasActiveFilters() && (
              <div className="active-filters-container">
                {filters.search && (
                  <span className="filter-tag">
                    <span className="tag-label">Search:</span> "{filters.search}" 
                    <FaTimes onClick={() => setFilters(p => ({...p, search: ''}))} />
                  </span>
                )}
                {filters.country && (
                  <span className="filter-tag">
                    <span className="tag-label">Country:</span> {filters.country}
                    <FaTimes onClick={() => setFilters(p => ({...p, country: ''}))} />
                  </span>
                )}
                {filters.profession && (
                  <span className="filter-tag">
                    <span className="tag-label">Profession:</span> {filters.profession}
                    <FaTimes onClick={() => setFilters(p => ({...p, profession: ''}))} />
                  </span>
                )}
                {filters.sortBy !== "newest" && (
                  <span className="filter-tag">
                    <span className="tag-label">Sort:</span> {filters.sortBy === "nameAsc" ? "A-Z" : "Z-A"}
                    <FaTimes onClick={() => setFilters(p => ({...p, sortBy: "newest"}))} />
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <p className="results-count">
              {!loading && (
                <>Found <strong>{totalMembers}</strong> {totalMembers === 1 ? 'researcher' : 'researchers'}</>
              )}
            </p>
          </div>

          {/* Members Grid */}
          <div className="members-main">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Connecting with our community...</p>
              </div>
            ) : members.length === 0 ? (
              <div className="no-members">
                <div className="no-members-icon"><FaUser /></div>
                <h3>No researchers found</h3>
                <p>Try adjusting your search criteria to find more results.</p>
                <button onClick={clearFilters} className="cta-button">Clear all filters</button>
              </div>
            ) : (
              <>
                <div className="members-grid">
                  {members.map((member) => (
                    <div key={member._id} className="member-card">
                      <div className="member-card-inner">
                        <div className="member-header">
                          <div className="member-avatar">
                            {member.profileImage && !imageErrors[member._id] ? (
                              <img 
                                src={getFullImageUrl(member.profileImage)} 
                                alt={member.fullName} 
                                onError={() => handleImageError(member._id)}
                              />
                            ) : (
                              <div className="avatar-initials" style={{ backgroundColor: `hsl(${member.fullName?.length * 30 % 360}, 70%, 55%)` }}>
                                {getInitials(member.fullName)}
                              </div>
                            )}
                          </div>
                          <div className="member-badge">
                            <span className="badge-icon">✓</span>
                          </div>
                        </div>

                        <div className="member-info">
                          <h3 className="member-name">{member.fullName}</h3>
                          <p className="member-profession">{member.profession || "Researcher"}</p>
                          <div className="member-location">
                            <FaMapMarkerAlt /> 
                            <span>{member.city ? `${member.city}, ` : ''}{member.country || "Location not specified"}</span>
                          </div>
                        </div>

                        <div className="member-qualification">
                          <FaGraduationCap className="qual-icon" />
                          <span>{member.academicQualifications?.split(',')[0] || "Academic"}</span>
                        </div>

                        <div className="member-socials">
                          {member.googleScholarProfile && (
                            <a href={member.googleScholarProfile} target="_blank" rel="noreferrer" className="social-link scholar" title="Google Scholar">
                              <FaBook />
                            </a>
                          )}
                          {member.researchGateProfile && (
                            <a href={member.researchGateProfile} target="_blank" rel="noreferrer" className="social-link researchgate" title="ResearchGate">
                              <FaResearchgate />
                            </a>
                          )}
                          {member.linkedinProfile && (
                            <a href={member.linkedinProfile} target="_blank" rel="noreferrer" className="social-link linkedin" title="LinkedIn">
                              <FaLinkedin />
                            </a>
                          )}
                        </div>

                        <button className="view-profile-btn" onClick={() => openModal(member)}>
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-wrapper">
                    <div className="pagination">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1}
                        className="page-btn prev"
                      >
                        <FaArrowLeft /> <span>Previous</span>
                      </button>
                      
                      <div className="page-numbers">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum = currentPage <= 3 ? i + 1 : 
                                        currentPage >= totalPages - 2 ? totalPages - 4 + i : 
                                        currentPage - 2 + i
                          if (pageNum < 1) pageNum = 1
                          if (pageNum > totalPages) pageNum = totalPages
                          
                          return (
                            <button 
                              key={pageNum} 
                              onClick={() => setCurrentPage(pageNum)}
                              className={`page-num ${currentPage === pageNum ? 'active' : ''}`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                      </div>

                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages}
                        className="page-btn next"
                      >
                        <span>Next</span> <FaArrowRight />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer Section - Redesigned */}
        <div className="members-footer">
          <div className="footer-grid">
            <div className="footer-card">
              <div className="footer-icon">
                <FaUserPlus />
              </div>
              <div className="footer-text">
                <h4>Join Our Network</h4>
                <p>Become part of a growing community of agricultural researchers and practitioners.</p>
                <Link to="/register" className="footer-link">Become a Member →</Link>
              </div>
            </div>
            <div className="footer-card">
              <div className="footer-icon">
                <FaHandHoldingUsd />
              </div>
              <div className="footer-text">
                <h4>Support Research</h4>
                <p>Help us advance sustainable agriculture through research and collaboration.</p>
                <Link to="/donate" className="footer-link donate-btn">Make a Donation →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Member Modal - Redesigned */}
      {isModalOpen && selectedMember && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            
            {loadingMemberDetails ? (
              <div className="modal-loading">
                <FaSpinner className="spinning" />
                <p>Loading profile details...</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <div className="modal-avatar">
                    {selectedMember.profileImage && !imageErrors[selectedMember._id] ? (
                      <img src={getFullImageUrl(selectedMember.profileImage)} alt="" />
                    ) : (
                      <div className="avatar-initials large" style={{ backgroundColor: `hsl(${selectedMember.fullName?.length * 30 % 360}, 70%, 55%)` }}>
                        {getInitials(selectedMember.fullName)}
                      </div>
                    )}
                  </div>
                  <div className="modal-title">
                    <h2>{selectedMember.fullName}</h2>
                    <p className="modal-role">{selectedMember.profession || "Researcher"}</p>
                    <div className="modal-location">
                      <FaMapMarkerAlt /> 
                      <span>{selectedMember.city ? `${selectedMember.city}, ` : ''}{selectedMember.country || "Location not specified"}</span>
                    </div>
                    <div className="modal-meta">
                      <span className="meta-item">
                        <FaCalendarAlt /> Member since {formatDate(selectedMember.createdAt)}
                      </span>
                      <span className="meta-item">
                        <FaUniversity /> {selectedMember.academicQualifications?.split(',')[0] || "Academic"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="modal-body">
                  {selectedMember.bio && (
                    <div className="modal-section bio-section">
                      <FaQuoteLeft className="bio-quote" />
                      <p>{selectedMember.bio}</p>
                    </div>
                  )}

                  <div className="modal-section">
                    <h4><FaGraduationCap /> Academic Background</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="d-label">Qualifications</span>
                        <span className="d-value">{selectedMember.academicQualifications || "Not specified"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="d-label">Research Areas</span>
                        <span className="d-value">{selectedMember.researchDisciplines || "Not specified"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="d-label">Affiliation</span>
                        <span className="d-value">{selectedMember.affiliation || "Not specified"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="d-label">Member ID</span>
                        <span className="d-value member-id">{selectedMember.memberID}</span>
                      </div>
                    </div>
                  </div>

                  {selectedMember.publications && selectedMember.publications.length > 0 && (
                    <div className="modal-section">
                      <h4><FaBook /> Publications</h4>
                      <ul className="publications-list">
                        {selectedMember.publications.slice(0, 5).map((pub, index) => (
                          <li key={index} className="pub-item">
                            <span className="pub-year">{pub.year}</span>
                            <p className="pub-title">{pub.title}</p>
                            {pub.journal && <span className="pub-journal">{pub.journal}</span>}
                          </li>
                        ))}
                      </ul>
                      {selectedMember.publications.length > 5 && (
                        <p className="more-pubs">+ {selectedMember.publications.length - 5} more publications</p>
                      )}
                    </div>
                  )}

                  <div className="modal-section">
                    <h4><FaGlobe /> Connect</h4>
                    <div className="modal-links">
                      {selectedMember.googleScholarProfile && (
                        <a href={selectedMember.googleScholarProfile} target="_blank" rel="noreferrer" className="modal-link scholar">
                          <FaBook /> Google Scholar
                        </a>
                      )}
                      {selectedMember.researchGateProfile && (
                        <a href={selectedMember.researchGateProfile} target="_blank" rel="noreferrer" className="modal-link researchgate">
                          <FaResearchgate /> ResearchGate
                        </a>
                      )}
                      {selectedMember.linkedinProfile && (
                        <a href={selectedMember.linkedinProfile} target="_blank" rel="noreferrer" className="modal-link linkedin">
                          <FaLinkedin /> LinkedIn
                        </a>
                      )}
                      {selectedMember.email && (
                        <a href={`mailto:${selectedMember.email}`} className="modal-link email">
                          <FaEnvelope /> Send Email
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FindMembers