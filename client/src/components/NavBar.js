"use client"

import { useState, useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"  // Use the useAuth hook instead
import "../styles/navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()  // Use the useAuth hook instead of useContext

  const isActive = (path) => location.pathname === path

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setIsResourcesOpen(false)
    setIsUpdatesOpen(false)
  }

  const toggleResources = () => {
    setIsResourcesOpen(!isResourcesOpen)
    setIsUpdatesOpen(false)
  }

  const toggleUpdates = () => {
    setIsUpdatesOpen(!isUpdatesOpen)
    setIsResourcesOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  return (
    <navbar className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-box">MCI</div>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className={`navbar-link ${isActive("/") ? "active" : ""}`} onClick={closeMenu}>
            Home
          </Link>

          <Link to="/about" className={`navbar-link ${isActive("/about") ? "active" : ""}`} onClick={closeMenu}>
            About
          </Link>

          <Link
            to="/muturu-cattle"
            className={`navbar-link ${isActive("/muturu-cattle") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Muturu Cattle Research
          </Link>

          <Link
            to="/members"
            className={`navbar-link ${isActive("/members") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Find Members
          </Link>

          <Link
            to="/donate"
            className={`navbar-link ${isActive("/donate") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Donate
          </Link>

          {/* Resources Dropdown */}
          <div className="navbar-nav-dropdown">
            <div
              className={`navbar-link nav-dropdown-toggle ${isActive("/publications") || isActive("/journals") ? "active" : ""}`} 
              onClick={toggleResources}
            >
              Resources
              <span className={`arrow ${isResourcesOpen ? "open" : ""}`}>▼</span>
            </div>
            <div className="nav-dropdown-menu">
              <Link to="/publications" className="nav-dropdown-item" onClick={closeMenu}>
                Publications
              </Link>
              <Link to="/journals" className="nav-dropdown-item" onClick={closeMenu}>
                Journals
              </Link>
            </div>
          </div>

          {/* Updates Dropdown */}
          <div className="navbar-nav-dropdown">
            <div 
              className={`navbar-link nav-dropdown-toggle ${isActive("/blogs") || isActive("/announcements") || isActive("/gallery") || isActive("/events") || isActive("/contact") ? "active" : ""}`} 
              onClick={toggleUpdates}
            >
              Updates
              <span className={`arrow ${isUpdatesOpen ? "open" : ""}`}>▼</span>
            </div>
            <div className="nav-dropdown-menu">
              <Link to="/blogs" className="nav-dropdown-item" onClick={closeMenu}>
                Blog
              </Link>
              <Link to="/announcements" className="nav-dropdown-item" onClick={closeMenu}>
                Announcements
              </Link>
              <Link to="/gallery" className="nav-dropdown-item" onClick={closeMenu}>
                Gallery
              </Link>
              <Link to="/events" className="nav-dropdown-item" onClick={closeMenu}>
                Events
              </Link>
              <Link to="/contact" className="nav-dropdown-item" onClick={closeMenu}>
                Contact
              </Link>
            </div>
          </div>

          {/* Conditional rendering based on authentication status */}
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`navbar-link ${isActive("/dashboard") ? "active" : ""}`} 
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="navbar-button secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`navbar-link ${isActive("/login") ? "active" : ""}`} onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="navbar-button" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>

        <div className={`navbar-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </navbar>
  )
}

export default Navbar