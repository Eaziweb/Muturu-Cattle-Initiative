"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import "../../styles/members.css"
import Navbar from "../../components/NavBar"
import {
  FaSearch, FaTimes, FaUser, FaMapMarkerAlt, FaGraduationCap,
  FaFlask, FaCalendarAlt, FaBook, FaResearchgate, FaUserPlus,
  FaHandHoldingUsd, FaFilter, FaSortAmountDown, FaSortAmountUp,
  FaEnvelope, FaPhone, FaGlobe, FaUniversity, FaChartLine,
  FaAward, FaRegClock, FaCheckCircle, FaUsers, FaFileAlt,
  FaLinkedin, FaTwitter, FaExternalLinkAlt, FaIdBadge,
  FaBriefcase, FaMapPin, FaNewspaper, FaLink
} from "react-icons/fa"


/* ─────────────────────────────────────────────
   MEMBER PROFILE MODAL
───────────────────────────────────────────── */
const MemberModal = ({ member, onClose, getFullImageUrl, imageErrors, handleImageError, getInitials, formatDate }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  if (!member) return null

  const sections = [
    {
      heading: "Personal information",
      rows: [
        { icon: <FaUser />, label: "Full name", value: `${member.title ? member.title + " " : ""}${member.fullName}` },
        { icon: <FaIdBadge />, label: "Profession", value: member.profession },
        { icon: <FaMapMarkerAlt />, label: "Location", value: [member.city, member.state, member.country].filter(Boolean).join(", ") },
        { icon: <FaEnvelope />, label: "Email", value: member.email, link: member.email ? `mailto:${member.email}` : null },
        { icon: <FaPhone />, label: "Phone", value: member.phone },
      ]
    },
    {
      heading: "Academic & research",
      rows: [
        { icon: <FaUniversity />, label: "Institution", value: member.institution },
        { icon: <FaGraduationCap />, label: "Qualifications", value: member.academicQualifications },
        { icon: <FaFlask />, label: "Research areas", value: member.researchDisciplines },
        { icon: <FaAward />, label: "Specialization", value: member.specialization },
        { icon: <FaBook />, label: "Publications", value: member.publicationCount ? `${member.publicationCount} peer-reviewed articles` : null },
      ]
    },
    {
      heading: "Online profiles",
      rows: [
        { icon: <FaBook />, label: "Google Scholar", value: member.googleScholarProfile, link: member.googleScholarProfile, external: true },
        { icon: <FaResearchgate />, label: "ResearchGate", value: member.researchGateProfile, link: member.researchGateProfile, external: true },
        { icon: <FaLinkedin />, label: "LinkedIn", value: member.linkedinProfile, link: member.linkedinProfile, external: true },
        { icon: <FaGlobe />, label: "Website", value: member.website, link: member.website, external: true },
      ]
    },
    {
      heading: "Membership details",
      rows: [
        { icon: <FaRegClock />, label: "Member since", value: member.createdAt ? formatDate(member.createdAt) : null },
        { icon: <FaCheckCircle />, label: "Status", value: member.membershipStatus || "Active" },
        { icon: <FaIdBadge />, label: "Member ID", value: member.memberId || member._id?.slice(-8)?.toUpperCase() },
      ]
    }
  ]

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Member profile">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-avatar-wrap">
            {member.profileImage && !imageErrors[member._id] ? (
              <img
                src={getFullImageUrl(member.profileImage)}
                alt={member.fullName}
                className="modal-avatar-img"
                onError={() => handleImageError(member._id)}
              />
            ) : (
              <div className="modal-avatar-initials">
                {getInitials(member.fullName)}
              </div>
            )}
          </div>

          <div className="modal-header-info">
            <h2 className="modal-name">
              {member.title && <span className="modal-title-prefix">{member.title} </span>}
              {member.fullName}
            </h2>
            {member.profession && <p className="modal-profession">{member.profession}</p>}
            {member.institution && (
              <p className="modal-institution">
                <FaUniversity style={{ fontSize: 11 }} />
                {member.institution}
              </p>
            )}
            <div className="modal-header-badges">
              {member.country && (
                <span className="modal-badge location">
                  <FaMapPin style={{ fontSize: 10 }} />
                  {[member.city, member.country].filter(Boolean).join(", ")}
                </span>
              )}
              {member.publicationCount > 0 && (
                <span className="modal-badge publications">
                  <FaNewspaper style={{ fontSize: 10 }} />
                  {member.publicationCount} publications
                </span>
              )}
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {member.bio && (
            <div className="modal-bio">
              <p>{member.bio}</p>
            </div>
          )}

          <div className="modal-sections">
            {sections.map((section) => {
              const visibleRows = section.rows.filter(r => r.value)
              if (visibleRows.length === 0) return null
              return (
                <div key={section.heading} className="modal-section">
                  <h3 className="modal-section-heading">{section.heading}</h3>
                  <div className="modal-rows">
                    {visibleRows.map((row) => (
                      <div key={row.label} className="modal-row">
                        <span className="modal-row-icon">{row.icon}</span>
                        <span className="modal-row-label">{row.label}</span>
                        <span className="modal-row-value">
                          {row.link ? (
                            <a
                              href={row.link}
                              target={row.external ? "_blank" : undefined}
                              rel={row.external ? "noopener noreferrer" : undefined}
                              className="modal-link"
                            >
                              {row.external
                                ? new URL(row.value.startsWith("http") ? row.value : `https://${row.value}`).hostname.replace("www.", "")
                                : row.value}
                              {row.external && <FaExternalLinkAlt style={{ fontSize: 10, marginLeft: 4 }} />}
                            </a>
                          ) : row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="modal-close-text-btn" onClick={onClose}>Close</button>
          <Link to={`/members/${member._id}`} className="modal-full-profile-btn">
            View full profile page <FaFileAlt style={{ fontSize: 12 }} />
          </Link>
        </div>

      </div>
    </div>
  )
}


/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
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

  // Modal state
  const [selectedMember, setSelectedMember] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"
    return `${baseUrl}/${imagePath}`
  }

  useEffect(() => {
    fetchMembers()
  }, [currentPage, filters, sortBy, sortOrder])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: currentPage, limit: 12,
        search: filters.search, country: filters.country,
        profession: filters.profession, specialization: filters.specialization,
        institution: filters.institution, minPublications: filters.minPublications,
        sortBy, sortOrder,
      })
      const response = await api.get(`/users/members?${queryParams}`)
      setMembers(response.data.users)
      setTotalPages(response.data.totalPages)
      setTotalMembers(response.data.total)

      if (currentPage === 1 && !filters.search && !filters.country && !filters.profession) {
        setCountries([...new Set(response.data.users.map(m => m.country).filter(Boolean))].sort())
        setProfessions([...new Set(response.data.users.map(m => m.profession).filter(Boolean))].sort())
        setSpecializations([...new Set(response.data.users.map(m => m.specialization).filter(Boolean))].sort())
        setInstitutions([...new Set(response.data.users.map(m => m.institution).filter(Boolean))].sort())
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  /* Open modal — optionally fetch full member details */
  const openMemberModal = useCallback(async (member) => {
    setSelectedMember(member)
    setModalLoading(true)
    try {
      const response = await api.get(`/users/members/${member._id}`)
      setSelectedMember(response.data)
    } catch {
      // silently fall back to card data already set above
    } finally {
      setModalLoading(false)
    }
  }, [])

  const closeModal = useCallback(() => setSelectedMember(null), [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
    setCurrentPage(1)
  }

  const handleSearchInput = (e) => {
    const value = e.target.value
    setFilters(prev => ({ ...prev, search: value }))
    setCurrentPage(1)
    setShowSearchSuggestions(value.length > 1 && searchHistory.some(s => s.toLowerCase().includes(value.toLowerCase())))
  }

  const handleSearchSuggestion = (suggestion) => {
    setFilters(prev => ({ ...prev, search: suggestion }))
    setShowSearchSuggestions(false)
    if (!searchHistory.includes(suggestion)) setSearchHistory(prev => [suggestion, ...prev].slice(0, 5))
  }

  const clearFilters = () => {
    setFilters({ search: "", country: "", profession: "", specialization: "", institution: "", minPublications: "" })
    setCurrentPage(1)
    setShowAdvancedFilters(false)
  }

  const handleSortChange = (sortField) => {
    if (sortBy === sortField) setSortOrder(prev => prev === "asc" ? "desc" : "asc")
    else { setSortBy(sortField); setSortOrder("asc") }
    setCurrentPage(1)
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long" })

  const handleImageError = (memberId) =>
    setImageErrors(prev => ({ ...prev, [memberId]: true }))

  const getInitials = (fullName) =>
    fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  const activeFilterCount = Object.values(filters).filter(v => v !== "").length

  return (
    <div className="member-section">
      <Navbar />

      {/* Hero */}
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

          {/* Filters */}
          <div className="filters-section">
            <div className="filters-header">
              <div className="filters-title">
                <FaFilter className="filters-icon" />
                <h3>Search & Filter Members</h3>
              </div>
              <div className="filters-actions">
                <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="advanced-filters-btn">
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

            <div className="filters-form">
              <div className="filter-group full-width">
                <label htmlFor="search"><FaSearch /> Search Members</label>
                <div className="input-wrapper">
                  <input
                    type="text" id="search" name="search" value={filters.search}
                    onChange={handleSearchInput}
                    onFocus={() => filters.search.length > 1 && setShowSearchSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                    placeholder="Search by name, expertise, or research area..."
                    className="filter-input"
                  />
                  <FaSearch className="input-search-icon" />
                  {showSearchSuggestions && searchHistory.length > 0 && (
                    <div className="search-suggestions">
                      {searchHistory.filter(s => s.toLowerCase().includes(filters.search.toLowerCase()))
                        .map((s, i) => (
                          <div key={i} onClick={() => handleSearchSuggestion(s)}>
                            <FaSearch /> {s}
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
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="profession">Professional Role</label>
                <select id="profession" name="profession" value={filters.profession} onChange={handleFilterChange}>
                  <option value="">All Professions</option>
                  {professions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {showAdvancedFilters && (
              <div className="advanced-filters">
                <div className="advanced-filters-grid">
                  <div className="filter-group">
                    <label htmlFor="specialization">Research Specialization</label>
                    <select id="specialization" name="specialization" value={filters.specialization} onChange={handleFilterChange}>
                      <option value="">All Specializations</option>
                      {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label htmlFor="institution">Institution / Organization</label>
                    <select id="institution" name="institution" value={filters.institution} onChange={handleFilterChange}>
                      <option value="">All Institutions</option>
                      {institutions.map(i => <option key={i} value={i}>{i}</option>)}
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

            <div className="sort-section">
              <div className="sort-label"><FaSortAmountDown /> Sort by:</div>
              <div className="sort-buttons">
                {[["name", "Name"], ["memberSince", "Member Since"], ["publications", "Publications"]].map(([field, label]) => (
                  <button key={field} className={`sort-btn ${sortBy === field ? "active" : ""}`} onClick={() => handleSortChange(field)}>
                    {label} {sortBy === field && (sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />)}
                  </button>
                ))}
              </div>
            </div>

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
                <div className="no-members-icon"><FaUser /></div>
                <h3>No members found</h3>
                <p>Try adjusting your search criteria or use different filters.</p>
                <button onClick={clearFilters} className="clear-filters-btn">Clear All Filters</button>
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
                            <div className="avatar-initials">{getInitials(member.fullName)}</div>
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
                        {[
                          { icon: <FaMapMarkerAlt />, label: "Location", value: [member.city, member.state, member.country].filter(Boolean).join(", ") },
                          member.institution && { icon: <FaUniversity />, label: "Institution", value: member.institution },
                          member.academicQualifications && { icon: <FaGraduationCap />, label: "Qualifications", value: member.academicQualifications },
                          member.researchDisciplines && { icon: <FaFlask />, label: "Research Areas", value: member.researchDisciplines },
                          member.specialization && { icon: <FaAward />, label: "Specialization", value: member.specialization },
                          member.publicationCount && { icon: <FaBook />, label: "Publications", value: `${member.publicationCount} peer-reviewed articles` },
                        ].filter(Boolean).map((item) => (
                          <div key={item.label} className="detail-item">
                            <div className="detail-icon">{item.icon}</div>
                            <div className="detail-content">
                              <span className="detail-label">{item.label}</span>
                              <span className="detail-value">{item.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="member-links">
                        {member.googleScholarProfile && (
                          <a href={member.googleScholarProfile} target="_blank" rel="noopener noreferrer" className="profile-link google-scholar">
                            <FaBook /> Google Scholar
                          </a>
                        )}
                        {member.researchGateProfile && (
                          <a href={member.researchGateProfile} target="_blank" rel="noopener noreferrer" className="profile-link research-gate">
                            <FaResearchgate /> ResearchGate
                          </a>
                        )}
                      </div>

                      <div className="member-card-footer">
                        {/* ← NOW a button that opens the modal */}
                        <button
                          className="view-profile-btn"
                          onClick={() => openMemberModal(member)}
                        >
                          View Profile <FaFileAlt />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination-wrapper">
                    <div className="pagination">
                      <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="pagination-btn first-last">First</button>
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="pagination-btn">Previous</button>
                      <div className="pagination-numbers">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let p = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i
                          return (
                            <button key={p} onClick={() => setCurrentPage(p)} className={`pagination-number ${currentPage === p ? "active" : ""}`}>{p}</button>
                          )
                        })}
                      </div>
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="pagination-btn">Next</button>
                      <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="pagination-btn first-last">Last</button>
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

        {/* Footer */}
        <div className="members-footer">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-icon"><FaUserPlus /></div>
              <div className="footer-text">
                <h4>Join Our Research Network</h4>
                <p>Connect with agricultural researchers and practitioners from around the world.</p>
                <Link to="/register" className="join-btn">Become a Member →</Link>
              </div>
            </div>
            <div className="footer-section">
              <div className="footer-icon"><FaHandHoldingUsd /></div>
              <div className="footer-text">
                <h4>Support Agricultural Research</h4>
                <p>Help us advance sustainable agriculture and preserve indigenous livestock breeds.</p>
                <Link to="/donate" className="donate-btn">Make a Donation →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MEMBER MODAL ── */}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={closeModal}
          getFullImageUrl={getFullImageUrl}
          imageErrors={imageErrors}
          handleImageError={handleImageError}
          getInitials={getInitials}
          formatDate={formatDate}
        />
      )}
    </div>
  )
}

export default FindMembers