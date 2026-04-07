"use client"

import { useState, useEffect } from "react"
import api from "../../utils/adminApi"
import styles from "../../styles/MembersSection.module.css"
import { FiSearch, FiMapPin, FiBriefcase, FiBook, FiUser, FiMail, FiGlobe, FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi"

const MemberSection = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("")
  const [professionFilter, setProfessionFilter] = useState("")
  const [countries, setCountries] = useState([])
  const [professions, setProfessions] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)

  useEffect(() => {
    fetchMembers()
    fetchFilters()
  }, [currentPage, searchTerm, countryFilter, professionFilter])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/users/members?page=${currentPage}&search=${searchTerm}&country=${countryFilter}&profession=${professionFilter}`)
      setMembers(response.data.users)
      setTotalPages(response.data.totalPages)
      setTotal(response.data.total)
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const response = await api.get(`/users/members/filters`)
      setCountries(response.data.countries || [])
      setProfessions(response.data.professions || [])
    } catch (error) {
      console.error("Error fetching filters:", error)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleCountryFilter = (e) => {
    setCountryFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleProfessionFilter = (e) => {
    setProfessionFilter(e.target.value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCountryFilter("")
    setProfessionFilter("")
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className={styles.memberSection}>
      <div className={styles.sectionHeader}>
        <h2>Verified Members</h2>
        <div className={styles.memberCount}>
          {total} {total === 1 ? "Member" : "Members"}
        </div>
      </div>

      <div className={styles.filtersContainer}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterSelect}>
            <FiMapPin className={styles.filterIcon} />
            <select value={countryFilter} onChange={handleCountryFilter}>
              <option value="">All Countries</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterSelect}>
            <FiBriefcase className={styles.filterIcon} />
            <select value={professionFilter} onChange={handleProfessionFilter}>
              <option value="">All Professions</option>
              {professions.map((profession, index) => (
                <option key={index} value={profession}>
                  {profession}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || countryFilter || professionFilter) && (
            <button className={styles.clearFiltersBtn} onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading members...</p>
        </div>
      ) : (
        <>
          {members.length === 0 ? (
            <div className={styles.emptyState}>
              <FiUser className={styles.emptyIcon} />
              <h3>No members found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className={styles.membersGrid}>
                {members.map((member) => (
                  <div key={member._id} className={styles.memberCard} onClick={() => setSelectedMember(member)}>
                    <div className={styles.memberHeader}>
                      <div className={styles.memberAvatar}>
                        {member.profileImage ? (
                          <img src={member.profileImage} alt={member.fullName} />
                        ) : (
                          <div className={styles.avatarInitials}>
                            {member.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className={styles.memberTitle}>
                        <h3>{member.fullName}</h3>
                        <p>{member.title}</p>
                      </div>
                    </div>

                    <div className={styles.memberDetails}>
                      <div className={styles.detailItem}>
                        <FiMapPin className={styles.detailIcon} />
                        <span>{member.country}, {member.state}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <FiBriefcase className={styles.detailIcon} />
                        <span>{member.profession}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <FiBook className={styles.detailIcon} />
                        <span>{member.academicQualifications}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <FiCalendar className={styles.detailIcon} />
                        <span>Member since {formatDate(member.createdAt)}</span>
                      </div>
                    </div>

                    <div className={styles.memberFooter}>
                      <div className={styles.memberId}>ID: {member.memberID}</div>
                      <button className={styles.viewProfileBtn}>View Profile</button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={styles.paginationBtn}
                  >
                    <FiChevronLeft />
                    <span>Previous</span>
                  </button>
                  <span className={styles.paginationInfo}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.paginationBtn}
                  >
                    <span>Next</span>
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {selectedMember && (
        <div className={styles.memberModal}>
          <div className={styles.memberModalContainer}>
            <div className={styles.modalHeader}>
              <h3>Member Profile</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedMember(null)}>
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>
                  {selectedMember.profileImage ? (
                    <img src={selectedMember.profileImage} alt={selectedMember.fullName} />
                  ) : (
                    <div className={styles.avatarInitials}>
                      {selectedMember.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                  )}
                </div>
                <div className={styles.profileInfo}>
                  <h2>{selectedMember.fullName}</h2>
                  <p>{selectedMember.title}</p>
                  <div className={styles.profileMeta}>
                    <span className={styles.metaItem}>
                      <FiMapPin />
                      {selectedMember.country}, {selectedMember.state}
                    </span>
                    <span className={styles.metaItem}>
                      <FiBriefcase />
                      {selectedMember.profession}
                    </span>
                    <span className={styles.metaItem}>
                      <FiCalendar />
                      Member since {formatDate(selectedMember.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.profileDetails}>
                <div className={styles.detailSection}>
                  <h4>Academic Qualifications</h4>
                  <p>{selectedMember.academicQualifications}</p>
                </div>

                <div className={styles.detailSection}>
                  <h4>Research Disciplines</h4>
                  <p>{selectedMember.researchDisciplines}</p>
                </div>

                <div className={styles.detailSection}>
                  <h4>Professional Profiles</h4>
                  <div className={styles.profileLinks}>
                    {selectedMember.googleScholarProfile && (
                      <a href={selectedMember.googleScholarProfile} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>
                        <FiGlobe />
                        Google Scholar
                      </a>
                    )}
                    {selectedMember.researchGateProfile && (
                      <a href={selectedMember.researchGateProfile} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>
                        <FiGlobe />
                        ResearchGate
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberSection