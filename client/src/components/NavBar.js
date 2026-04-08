"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "../styles/navbar.css"

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [resDropdown, setResDropdown] = useState(false)
  const [updDropdown, setUpdDropdown] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const checkPath = (path) => location.pathname === path

  const resetNav = () => {
    setMenuVisible(false)
    setResDropdown(false)
    setUpdDropdown(false)
  }

  const togglePrimaryMenu = () => setMenuVisible(!menuVisible)

  const toggleRes = (e) => {
    e.stopPropagation()
    setResDropdown(!resDropdown)
    setUpdDropdown(false)
  }

  const toggleUpd = (e) => {
    e.stopPropagation()
    setUpdDropdown(!updDropdown)
    setResDropdown(false)
  }

  const exitSession = () => {
    logout()
    resetNav()
  }

  return (
    <nav className="site-header">
      <div className="header-wrapper">
        <Link to="/" className="brand-anchor" onClick={resetNav}>
          <div className="brand-badge">MCI</div>
        </Link>

        <div className={`nav-portal ${menuVisible ? "show-portal" : ""}`}>
          <Link to="/" className={`portal-item ${checkPath("/") ? "active-item" : ""}`} onClick={resetNav}>
            Home
          </Link>

          <Link to="/about" className={`portal-item ${checkPath("/about") ? "active-item" : ""}`} onClick={resetNav}>
            About
          </Link>

          <Link to="/muturu-cattle" className={`portal-item ${checkPath("/muturu-cattle") ? "active-item" : ""}`} onClick={resetNav}>
            Research
          </Link>

          {/* Resources Group */}
          <div className="nested-group">
            <button 
              className={`portal-item group-trigger ${checkPath("/publications") || checkPath("/journals") ? "active-item" : ""}`} 
              onClick={toggleRes}
            >
              Resources <span className={`chevron ${resDropdown ? "flip" : ""}`}>▼</span>
            </button>
            <div className={`group-content ${resDropdown ? "content-open" : ""}`}>
              <Link to="/publications" className="group-link" onClick={resetNav}>Publications</Link>
              <Link to="/journals" className="group-link" onClick={resetNav}>Journals</Link>
            </div>
          </div>

          {/* Updates Group */}
          <div className="nested-group">
            <button 
              className={`portal-item group-trigger ${checkPath("/blogs") || checkPath("/events") ? "active-item" : ""}`} 
              onClick={toggleUpd}
            >
              Updates <span className={`chevron ${updDropdown ? "flip" : ""}`}>▼</span>
            </button>
            <div className={`group-content ${updDropdown ? "content-open" : ""}`}>
              <Link to="/blogs" className="group-link" onClick={resetNav}>Blog</Link>
              <Link to="/announcements" className="group-link" onClick={resetNav}>Announcements</Link>
              <Link to="/gallery" className="group-link" onClick={resetNav}>Gallery</Link>
              <Link to="/events" className="group-link" onClick={resetNav}>Events</Link>
              <Link to="/contact" className="group-link" onClick={resetNav}>Contact</Link>
            </div>
          </div>

          {user ? (
            <>
              <Link to="/dashboard" className={`portal-item ${checkPath("/dashboard") ? "active-item" : ""}`} onClick={resetNav}>
                Dashboard
              </Link>
              <button onClick={exitSession} className="action-btn alt-style">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="portal-item" onClick={resetNav}>Login</Link>
              <Link to="/register" className="action-btn" onClick={resetNav}>Register</Link>
            </>
          )}
        </div>

        <button className={`menu-hamburger ${menuVisible ? "switch" : ""}`} onClick={togglePrimaryMenu}>
          <i className="stripe"></i>
          <i className="stripe"></i>
          <i className="stripe"></i>
        </button>
      </div>
    </nav>
  )
}

export default Navbar