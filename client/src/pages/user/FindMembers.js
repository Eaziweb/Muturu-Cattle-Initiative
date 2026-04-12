"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import "../../styles/members.css"
import Navbar from "../../components/NavBar"
import { 
  FaSearch, FaTimes, FaUser, FaMapMarkerAlt, FaGraduationCap, 
  FaFlask, FaCalendarAlt, FaBook, FaResearchgate, FaUserPlus, 
  FaHandHoldingUsd, FaFilter, FaSortAmountDown, FaSortAmountUp,
  FaEnvelope, FaPhone, FaGlobe, FaUniversity, FaChartLine,
  FaAward, FaRegClock, FaCheckCircle, FaUsers, FaFileAlt
} from "react-icons/fa"

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
    specialization: "",
    institution: "",
    minPublications: "",
  })
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [countries, setCountries] = useState([])
  const [professions, setProfessions] = useState([])
  const [specializations, setSpecializations] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [imageErrors, setImageErrors] = useState({})
  const [searchHistory, setSearchHistory] = useState([])
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)

  // Get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'
    return `${baseUrl}/${imagePath}`
  }

  useEffect(() => {
    fetchMembers()
  }, [currentPage, filters, sortBy, sortOrder])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 12,
        search: filters.search,
        country: filters.country,
        profession: filters.profession,
        specialization: filters.specialization,
        institution: filters.institution,
        minPublications: filters.minPublications,
        sortBy,
        sortOrder,
      })

      const response = await api.get(`/users/members?${queryParams}`)
      setMembers(response.data.users)
      setTotalPages(response.data.totalPages)
      setTotalMembers(response.data.total)

      // Extract filter options
      if (currentPage === 1 && !filters.search && !filters.country && !filters.profession) {
        const uniqueCountries = [...new Set(response.data.users.map(m => m.country).filter(Boolean))].sort()
        const uniqueProfessions = [...new Set(response.data.users.map(m => m.profession).filter(Boolean))].sort()
        const uniqueSpecializations = [...new Set(response.data.users.map(m => m.specialization).filter(Boolean))].sort()
        const uniqueInstitutions = [...new Set(response.data.users.map(m => m.institution).filter(Boolean))].sort()
        
        setCountries(uniqueCountries)
        setProfessions(uniqueProfessions)
        setSpecializations(uniqueSpecializations)
        setInstitutions(uniqueInstitutions)
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }))
    setCurrentPage(1)
  }

  const handleSearchInput = (e) => {
    const value = e.target.value
    setFilters(prev => ({ ...prev, search: value }))
    setCurrentPage(1)
    
    // Show suggestions
    if (value.length > 1) {
      const suggestions = searchHistory.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      )
      setShowSearchSuggestions(suggestions.length > 0)
    } else {
      setShowSearchSuggestions(false)
    }
  }

  const handleSearchSuggestion = (suggestion) => {
    setFilters(prev => ({ ...prev, search: suggestion }))
    setShowSearchSuggestions(false)
    // Add to search history
    if (!searchHistory.includes(suggestion)) {
      setSearchHistory(prev => [suggestion, ...prev].slice(0, 5))
    }
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      country: "",
      profession: "",
      specialization: "",
      institution: "",
      minPublications: "",
    })
    setCurrentPage(1)
    setShowAdvancedFilters(false)
  }

  const handleSortChange = (sortField) => {
    if (sortBy === sortField) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortBy(sortField)
      setSortOrder("asc")
    }
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

  const getInitials = (fullName) => {
    return fullName
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const activeFilterCount = Object.values(filters).filter(v => v && v !== "").length

  return (
    <div className="member-section">
      <Navbar />
      
      {/* Hero Section */}
      <div className="members-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Research Network Directory</h1>
            <p>Connect with leading researchers and practitioners in agricultural science</p>
            <div className="hero-stats">
              <div className="stat-badge">
                <FaUsers className="stat-icon" />
                <span>{totalMembers.toLocaleString()} Active Members</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="members-container">
        <div className="members-content">
          {/* Enhanced Filters Section */}
          <div className="filters-section">
            <div className="filters-header">
              <div className="filters-title">
                <FaFilter className="filters-icon" />
                <h3>Search & Filter Members</h3>
              </div>
              <div className="filters-actions">
                <button 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} 
                  className="advanced-filters-btn"
                >
                  <FaChartLine />
                  {showAdvancedFilters ? "Hide Advanced" : "Show Advanced"}
                </button>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="clear-filters-btn">
                    <FaTimes /> Clear All ({activeFilterCount})
                  </button>
                )}
              </div>
            </div>

            {/* Basic Search */}
            <div className="filters-form">
              <div className="filter-group full-width">
                <label htmlFor="search">
                  <FaSearch /> Search Members
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleSearchInput}
                    onFocus={() => filters.search.length > 1 && setShowSearchSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                    placeholder="Search by name, expertise, or research area..."
                    className="filter-input"
                  />
                  <FaSearch className="input-search-icon" />
                  {showSearchSuggestions && searchHistory.length > 0 && (
                    <div className="search-suggestions">
                      {searchHistory.filter(s => 
                        s.toLowerCase().includes(filters.search.toLowerCase())
                      ).map((suggestion, index) => (
                        <div key={index} onClick={() => handleSearchSuggestion(suggestion)}>
                          <FaSearch /> {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="filter-group">
                <label htmlFor="country">Country / Region</label>
                <select id="country" name="country" value={filters.country} onChange={handleFilterChange}>
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="profession">Professional Role</label>
                <select id="profession" name="profession" value={filters.profession} onChange={handleFilterChange}>
                  <option value="">All Professions</option>
                  {professions.map((profession) => (
                    <option key={profession} value={profession}>{profession}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="advanced-filters">
                <div className="advanced-filters-grid">
                  <div className="filter-group">
                    <label htmlFor="specialization">Research Specialization</label>
                    <select id="specialization" name="specialization" value={filters.specialization} onChange={handleFilterChange}>
                      <option value="">All Specializations</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label htmlFor="institution">Institution / Organization</label>
                    <select id="institution" name="institution" value={filters.institution} onChange={handleFilterChange}>
                      <option value="">All Institutions</option>
                      {institutions.map((inst) => (
                        <option key={inst} value={inst}>{inst}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label htmlFor="minPublications">Minimum Publications</label>
                    <select id="minPublications" name="minPublications" value={filters.minPublications} onChange={handleFilterChange}>
                      <option value="">Any</option>
                      <option value="1">1+ Publications</option>
                      <option value="5">5+ Publications</option>
                      <option value="10">10+ Publications</option>
                      <option value="20">20+ Publications</option>
                      <option value="50">50+ Publications</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Sort Options */}
            <div className="sort-section">
              <div className="sort-label">
                <FaSortAmountDown /> Sort by:
              </div>
              <div className="sort-buttons">
                <button 
                  className={`sort-btn ${sortBy === "name" ? "active" : ""}`}
                  onClick={() => handleSortChange("name")}
                >
                  Name {sortBy === "name" && (sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />)}
                </button>
                <button 
                  className={`sort-btn ${sortBy === "memberSince" ? "active" : ""}`}
                  onClick={() => handleSortChange("memberSince")}
                >
                  Member Since {sortBy === "memberSince" && (sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />)}
                </button>
                <button 
                  className={`sort-btn ${sortBy === "publications" ? "active" : ""}`}
                  onClick={() => handleSortChange("publications")}
                >
                  Publications {sortBy === "publications" && (sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />)}
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="active-filters">
                <div className="active-filters-label">Active Filters:</div>
                <div className="active-filters-list">
                  {filters.search && <span className="filter-tag"><FaSearch /> Search: {filters.search}</span>}
                  {filters.country && <span className="filter-tag"><FaGlobe /> {filters.country}</span>}
                  {filters.profession && <span className="filter-tag"><FaUser /> {filters.profession}</span>}
                  {filters.specialization && <span className="filter-tag"><FaFlask /> {filters.specialization}</span>}
                  {filters.institution && <span className="filter-tag"><FaUniversity /> {filters.institution}</span>}
                  {filters.minPublications && <span className="filter-tag"><FaBook /> {filters.minPublications}+ Publications</span>}
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <div className="results-count">
              <FaUsers className="results-icon" />
              <span>Found <strong>{totalMembers.toLocaleString()}</strong> researchers</span>
            </div>
            <div className="results-view-options">
              <span>Showing page {currentPage} of {totalPages}</span>
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
                <p>Try adjusting your search criteria or use different filters to find researchers.</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear All Filters
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
                              {getInitials(member.fullName)}
                            </div>
                          )}
                        </div>
                        <div className="member-basic-info">
                          <h3 className="member-name">
                            {member.title && `${member.title} `}{member.fullName}
                          </h3>
                          <p className="member-role">{member.profession || "Researcher"}</p>
                          <p className="member-id">
                            <FaRegClock /> Member since {formatDate(member.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="member-details">
                        <div className="detail-item">
                          <div className="detail-icon">
                            <FaMapMarkerAlt />
                          </div>
                          <div className="detail-content">
                            <span className="detail-label">Location</span>
                            <span className="detail-value">
                              {member.city && `${member.city}, `}{member.state && `${member.state}, `}{member.country}
                            </span>
                          </div>
                        </div>

                        {member.institution && (
                          <div className="detail-item">
                            <div className="detail-icon">
                              <FaUniversity />
                            </div>
                            <div className="detail-content">
                              <span className="detail-label">Institution</span>
                              <span className="detail-value">{member.institution}</span>
                            </div>
                          </div>
                        )}

                        {member.academicQualifications && (
                          <div className="detail-item">
                            <div className="detail-icon">
                              <FaGraduationCap />
                            </div>
                            <div className="detail-content">
                              <span className="detail-label">Qualifications</span>
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
                              <span className="detail-label">Research Areas</span>
                              <span className="detail-value">{member.researchDisciplines}</span>
                            </div>
                          </div>
                        )}

                        {member.specialization && (
                          <div className="detail-item">
                            <div className="detail-icon">
                              <FaAward />
                            </div>
                            <div className="detail-content">
                              <span className="detail-label">Specialization</span>
                              <span className="detail-value">{member.specialization}</span>
                            </div>
                          </div>
                        )}

                        {member.publicationCount && (
                          <div className="detail-item">
                            <div className="detail-icon">
                              <FaBook />
                            </div>
                            <div className="detail-content">
                              <span className="detail-label">Publications</span>
                              <span className="detail-value">{member.publicationCount} peer-reviewed articles</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="member-links">
                        {member.googleScholarProfile && (
                          <a
                            href={member.googleScholarProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="profile-link google-scholar"
                          >
                            <FaBook /> Google Scholar
                          </a>
                        )}
                        {member.researchGateProfile && (
                          <a
                            href={member.researchGateProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="profile-link research-gate"
                          >
                            <FaResearchgate /> ResearchGate
                          </a>
                        )}
                      </div>

                      <div className="member-card-footer">
                        <Link to={`/members/${member._id}`} className="view-profile-btn">
                          View Full Profile <FaFileAlt />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-wrapper">
                    <div className="pagination">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="pagination-btn first-last"
                      >
                        First
                      </button>
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
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="pagination-btn first-last"
                      >
                        Last
                      </button>
                    </div>

                    <div className="pagination-info">
                      <FaCheckCircle className="info-icon" />
                      Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, totalMembers)} of {totalMembers.toLocaleString()} members
                    </div>
                  </div>
                )}
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
                <h4>Join Our Research Network</h4>
                <p>Connect with agricultural researchers and practitioners from around the world. Share your research and collaborate on impactful projects.</p>
                <Link to="/register" className="join-btn">
                  Become a Member →
                </Link>
              </div>
            </div>

            <div className="footer-section">
              <div className="footer-icon">
                <FaHandHoldingUsd />
              </div>
              <div className="footer-text">
                <h4>Support Agricultural Research</h4>
                <p>Help us advance sustainable agriculture and preserve indigenous livestock breeds for future generations.</p>
                <Link to="/donate" className="donate-btn">
                  Make a Donation →
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