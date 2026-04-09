"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import "../../styles/members.css"
import Navbar from "../../components/NavBar"
import { 
  FaSearch, FaTimes, FaUser, FaMapMarkerAlt, FaGraduationCap, 
  FaFlask, FaCalendarAlt, FaBook, FaResearchgate, FaUserPlus, 
  FaHandHoldingUsd, FaChevronDown, FaChevronUp, FaFileAlt 
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

  const [filters, setFilters] = useState({
    search: "",
    country: "",
    profession: "",
    sortBy: "newest" // Added sort option
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
        sort: filters.sortBy // Pass sort to backend if supported, otherwise handle in JS
      })

      const response = await api.get(`/users/members?${queryParams}`)
      let users = response.data.users || []

      // Client-side sorting if backend doesn't support the 'sort' param specifically
      if (filters.sortBy === "nameAsc") {
        users.sort((a, b) => a.fullName.localeCompare(b.fullName))
      } else if (filters.sortBy === "nameDesc") {
        users.sort((a, b) => b.fullName.localeCompare(a.fullName))
      }
      // 'newest' is default backend behavior usually

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

  // --- Modal Logic ---
  const openModal = async (member) => {
    setSelectedMember(member) // Set basic info immediately
    setIsModalOpen(true)
    setLoadingMemberDetails(true)

    try {
      // Fetch full details for this specific user
      // This endpoint should return bio, publications list, detailed qualifications, etc.
      const response = await api.get(`/users/${member._id}/details`) 
      setSelectedMember(response.data) // Update with full details
    } catch (error) {
      console.error("Could not fetch extra details", error)
      // We keep the basic member info if the detailed fetch fails
    } finally {
      setLoadingMemberDetails(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedMember(null)
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
            <p>Connect with researchers and practitioners in our global agricultural network</p>
          </div>
        </div>
      </div>

      <div className="members-container">
        <div className="members-content">
          {/* Filters Section */}
          <div className="filters-section">
            <div className="filters-header">
              <h3><FaSearch className="icon" /> Explore Directory</h3>
              <div className="filter-actions">
                {Object.values(filters).some(v => v) && (
                   <button onClick={clearFilters} className="clear-filters-btn">
                    <FaTimes className="icon" /> Reset
                  </button>
                )}
              </div>
            </div>

            <div className="filters-grid">
              {/* Search Input */}
              <div className="filter-group search-group">
                <div className="input-wrapper">
                  <FaSearch className="input-icon" />
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by name, ID..."
                    className="custom-input"
                  />
                </div>
              </div>

              {/* Sort Select */}
              <div className="filter-group">
                <div className="select-wrapper">
                  <select 
                    name="sortBy" 
                    value={filters.sortBy} 
                    onChange={handleFilterChange}
                    className="custom-select"
                  >
                    <option value="newest">Newest Members</option>
                    <option value="nameAsc">Name (A-Z)</option>
                    <option value="nameDesc">Name (Z-A)</option>
                  </select>
                  <FaChevronDown className="select-arrow" />
                </div>
              </div>

              {/* Country Select */}
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

              {/* Profession Select */}
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
            <div className="active-filters-container">
              {filters.search && (
                <span className="filter-tag">
                  Search: "{filters.search}" <FaTimes onClick={() => setFilters(p => ({...p, search: ''}))} />
                </span>
              )}
              {filters.country && (
                <span className="filter-tag">
                  {filters.country} <FaTimes onClick={() => setFilters(p => ({...p, country: ''}))} />
                </span>
              )}
              {filters.profession && (
                <span className="filter-tag">
                  {filters.profession} <FaTimes onClick={() => setFilters(p => ({...p, profession: ''}))} />
                </span>
              )}
            </div>
          </div>

          {/* Members Grid */}
          <div className="members-main">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Searching directory...</p>
              </div>
            ) : members.length === 0 ? (
              <div className="no-members">
                <div className="no-members-icon"><FaUser /></div>
                <h3>No members found</h3>
                <p>Try adjusting your search terms.</p>
                <button onClick={clearFilters} className="cta-button">Clear Filters</button>
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
                              onError={() => handleImageError(member._id)}
                            />
                          ) : (
                            <div className="avatar-initials">
                              {member.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <div className="member-basic-info">
                          <h3>{member.title} {member.fullName}</h3>
                          <p className="member-role">{member.profession}</p>
                          <div className="member-location">
                            <FaMapMarkerAlt /> {member.state}, {member.country}
                          </div>
                        </div>
                      </div>

                      <div className="member-body">
                        <div className="info-row">
                          <span className="info-label">Qualifications:</span>
                          <span className="info-value">{member.academicQualifications || "Not specified"}</span>
                        </div>
                        
                        <div className="info-row">
                          <span className="info-label">Joined:</span>
                          <span className="info-value">{formatDate(member.createdAt)}</span>
                        </div>
                      </div>

                      {/* Always Visible Links */}
                      <div className="member-socials">
                        {member.googleScholarProfile && (
                          <a href={member.googleScholarProfile} target="_blank" rel="noreferrer" className="social-link scholar">
                            <FaBook /> Google Scholar
                          </a>
                        )}
                        {member.researchGateProfile && (
                          <a href={member.researchGateProfile} target="_blank" rel="noreferrer" className="social-link researchgate">
                            <FaResearchgate /> ResearchGate
                          </a>
                        )}
                      </div>

                      <div className="member-footer">
                        <button className="know-more-btn" onClick={() => openModal(member)}>
                          View Full Profile
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
                        className="page-btn"
                      >
                        Previous
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
                        className="page-btn"
                      >
                        Next
                      </button>
                    </div>
                    <p className="page-info">
                      Showing {(currentPage - 1) * 12 + 1} - {Math.min(currentPage * 12, totalMembers)} of {totalMembers} members
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="members-footer">
          <div className="footer-grid">
            <div className="footer-card">
              <div className="footer-icon-bg"><FaUserPlus /></div>
              <div className="footer-text">
                <h4>Join Our Network</h4>
                <p>Connect with agricultural researchers worldwide.</p>
                <Link to="/register" className="footer-link">Become a Member</Link>
              </div>
            </div>
            <div className="footer-card">
              <div className="footer-icon-bg"><FaHandHoldingUsd /></div>
              <div className="footer-text">
                <h4>Support Our Mission</h4>
                <p>Help advance sustainable agriculture.</p>
                <Link to="/donate" className="footer-link donate">Make a Donation</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Member Modal */}
      {isModalOpen && selectedMember && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}><FaTimes /></button>
            
            <div className="modal-header">
              <div className="modal-avatar">
                {selectedMember.profileImage && !imageErrors[selectedMember._id] ? (
                  <img src={getFullImageUrl(selectedMember.profileImage)} alt="" />
                ) : (
                  <div className="avatar-initials">
                    {selectedMember.fullName?.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </div>
                )}
              </div>
              <div className="modal-title">
                <h2>{selectedMember.title} {selectedMember.fullName}</h2>
                <p className="modal-subtitle">{selectedMember.profession}</p>
                <p className="modal-location"><FaMapMarkerAlt /> {selectedMember.state}, {selectedMember.country}</p>
              </div>
            </div>

            <div className="modal-body">
              {loadingMemberDetails ? (
                <div className="modal-loading">
                   <div className="spinner-small"></div> Loading full profile...
                </div>
              ) : (
                <>
                  {/* Bio */}
                  {selectedMember.bio && (
                    <div className="modal-section">
                      <h4><FaUser className="section-icon" /> About</h4>
                      <p>{selectedMember.bio}</p>
                    </div>
                  )}

                  {/* Academic Details */}
                  <div className="modal-section">
                    <h4><FaGraduationCap className="section-icon" /> Academic Profile</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="d-label">Highest Qualification:</span>
                        <span className="d-value">{selectedMember.academicQualifications || "N/A"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="d-label">Research Disciplines:</span>
                        <span className="d-value">{selectedMember.researchDisciplines || "N/A"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="d-label">Member Since:</span>
                        <span className="d-value">{formatDate(selectedMember.createdAt)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="d-label">Member ID:</span>
                        <span className="d-value">{selectedMember.memberID}</span>
                      </div>
                    </div>
                  </div>

                  {/* Publications (Fetched on demand) */}
                  <div className="modal-section">
                    <h4><FaFileAlt className="section-icon" /> Recent Publications</h4>
                    {selectedMember.publications && selectedMember.publications.length > 0 ? (
                      <ul className="publications-list">
                        {selectedMember.publications.map((pub, index) => (
                          <li key={index} className="pub-item">
                            <span className="pub-year">{pub.year}</span>
                            <p className="pub-title">{pub.title}</p>
                            {pub.journal && <span className="pub-journal">{pub.journal}</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-data">No publications listed.</p>
                    )}
                  </div>

                  {/* Contact / Extra Info */}
                  <div className="modal-section">
                    <h4>Contact & Socials</h4>
                    <div className="modal-links">
                      {selectedMember.googleScholarProfile && (
                        <a href={selectedMember.googleScholarProfile} target="_blank" rel="noreferrer" className="modal-link-btn">
                          <FaBook /> View Google Scholar
                        </a>
                      )}
                      {selectedMember.researchGateProfile && (
                        <a href={selectedMember.researchGateProfile} target="_blank" rel="noreferrer" className="modal-link-btn">
                          <FaResearchgate /> View ResearchGate
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FindMembers