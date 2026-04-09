"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import "../../styles/members.css"
import Navbar from "../../components/NavBar"
import { 
  FaSearch, FaTimes, FaUser, FaMapMarkerAlt, FaGraduationCap, 
  FaFlask, FaCalendarAlt, FaBook, FaResearchgate, FaUserPlus, 
  FaHandHoldingUsd, FaChevronRight, FaPhone, FaInfoCircle 
} from "react-icons/fa"

const FindMembers = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalMembers, setTotalMembers] = useState(0)
  const [filters, setFilters] = useState({ search: "", country: "", profession: "" })
  const [countries, setCountries] = useState([])
  const [professions, setProfessions] = useState([])
  const [imageErrors, setImageErrors] = useState({})
  
  // Modal State
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchMembers()
  }, [currentPage, filters])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...filters
      })
      const response = await api.get(`/users/members?${queryParams}`)
      setMembers(response.data.users)
      setTotalPages(response.data.totalPages)
      setTotalMembers(response.data.total)

      if (currentPage === 1 && !filters.search && !filters.country && !filters.profession) {
        setCountries([...new Set(response.data.users.map(m => m.country))].sort())
        setProfessions([...new Set(response.data.users.map(m => m.profession))].sort())
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleShowMore = async (memberId) => {
    setModalLoading(true);
    try {
      // Fetch full details for this specific user
      const response = await api.get(`/users/profile/${memberId}`);
      setSelectedMember(response.data);
    } catch (error) {
      console.error("Error fetching full profile:", error);
    } finally {
      setModalLoading(false);
    }
  }

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return `${baseUrl}/${imagePath}`;
  }

  return (
    <div className="member-section">
      <Navbar />
      
      <div className="members-hero">
        <div className="hero-content">
          <h1>Member Directory</h1>
          <p>Search and connect with {totalMembers} global researchers</p>
        </div>
      </div>

      <div className="members-container">
        {/* Modern Search Bar */}
        <div className="search-box-container">
          <div className="main-search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name, research area, or keyword..." 
              name="search"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
            <div className="filter-dropdowns">
              <select name="country" onChange={(e) => setFilters({...filters, country: e.target.value})}>
                <option value="">Any Country</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select name="profession" onChange={(e) => setFilters({...filters, profession: e.target.value})}>
                <option value="">Any Profession</option>
                {professions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="members-grid">
          {loading ? (
            <p>Loading directory...</p>
          ) : members.map((member) => (
            <div key={member._id} className="member-card">
              <div className="card-top">
                <div className="avatar-wrapper">
                   {member.profileImage && !imageErrors[member._id] ? (
                     <img src={getFullImageUrl(member.profileImage)} alt="" onError={() => setImageErrors({...imageErrors, [member._id]: true})}/>
                   ) : <div className="avatar-placeholder">{member.fullName[0]}</div>}
                </div>
                <div className="name-area">
                  <h3>{member.title} {member.fullName}</h3>
                  <span className="badge">{member.profession}</span>
                </div>
              </div>

              <div className="card-mid">
                <div className="info-row"><FaMapMarkerAlt /> {member.state}, {member.country}</div>
                
                {/* Profile Links moved here by default */}
                <div className="social-links-minimal">
                  {member.googleScholarProfile && (
                    <a href={member.googleScholarProfile} target="_blank" rel="noreferrer" title="Google Scholar"><FaBook /></a>
                  )}
                  {member.researchGateProfile && (
                    <a href={member.researchGateProfile} target="_blank" rel="noreferrer" title="ResearchGate"><FaResearchgate /></a>
                  )}
                </div>
              </div>

              <button className="view-more-btn" onClick={() => handleShowMore(member._id)}>
                View Profile <FaChevronRight />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- QUICK VIEW MODAL --- */}
      {selectedMember && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedMember(null)}><FaTimes /></button>
            
            <div className="modal-header">
              <div className="modal-avatar">
                {selectedMember.profileImage ? (
                  <img src={getFullImageUrl(selectedMember.profileImage)} alt=""/>
                ) : <div className="avatar-placeholder big">{selectedMember.fullName[0]}</div>}
              </div>
              <h2>{selectedMember.title} {selectedMember.fullName}</h2>
              <p className="modal-profession">{selectedMember.profession}</p>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4><FaInfoCircle /> About / Bio</h4>
                <p>{selectedMember.bio || "No biography provided."}</p>
              </div>

              <div className="modal-grid-info">
                <div>
                  <h4><FaGraduationCap /> Qualifications</h4>
                  <p>{selectedMember.academicQualifications || "Not specified"}</p>
                </div>
                <div>
                  <h4><FaFlask /> Research Disciplines</h4>
                  <p>{selectedMember.researchDisciplines || "Not specified"}</p>
                </div>
              </div>

              <div className="modal-footer-links">
                {selectedMember.googleScholarProfile && (
                  <a href={selectedMember.googleScholarProfile} target="_blank" className="link-btn scholar">
                    <FaBook /> Google Scholar
                  </a>
                )}
                {selectedMember.researchGateProfile && (
                  <a href={selectedMember.researchGateProfile} target="_blank" className="link-btn rgate">
                    <FaResearchgate /> ResearchGate
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FindMembers;