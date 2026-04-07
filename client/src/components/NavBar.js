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
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <div className="logo-box">MCRN</div>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`} onClick={closeMenu}>
            Home
          </Link>

          <Link to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`} onClick={closeMenu}>
            About
          </Link>

          <Link
            to="/muturu-cattle"
            className={`nav-link ${isActive("/muturu-cattle") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Muturu Cattle Research
          </Link>

          <Link
            to="/members"
            className={`nav-link ${isActive("/members") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Find Members
          </Link>

          <Link
            to="/donate"
            className={`nav-link ${isActive("/donate") ? "active" : ""}`}
            onClick={closeMenu}
          >
            Donate
          </Link>

          {/* Resources Dropdown */}
          <div className="nav-dropdown">
            <button 
              className={`nav-link dropdown-toggle ${isActive("/publications") || isActive("/journals") ? "active" : ""}`} 
              onClick={toggleResources}
            >
              Resources
              <span className={`arrow ${isResourcesOpen ? "open" : ""}`}>▼</span>
            </button>
            <div className="dropdown-menu">
              <Link to="/publications" className="dropdown-item" onClick={closeMenu}>
                Publications
              </Link>
              <Link to="/journals" className="dropdown-item" onClick={closeMenu}>
                Journals
              </Link>
            </div>
          </div>

          {/* Updates Dropdown */}
          <div className="nav-dropdown">
            <button 
              className={`nav-link dropdown-toggle ${isActive("/blogs") || isActive("/announcements") || isActive("/gallery") || isActive("/events") || isActive("/contact") ? "active" : ""}`} 
              onClick={toggleUpdates}
            >
              Updates
              <span className={`arrow ${isUpdatesOpen ? "open" : ""}`}>▼</span>
            </button>
            <div className="dropdown-menu">
              <Link to="/blogs" className="dropdown-item" onClick={closeMenu}>
                Blog
              </Link>
              <Link to="/announcements" className="dropdown-item" onClick={closeMenu}>
                Announcements
              </Link>
              <Link to="/gallery" className="dropdown-item" onClick={closeMenu}>
                Gallery
              </Link>
              <Link to="/events" className="dropdown-item" onClick={closeMenu}>
                Events
              </Link>
              <Link to="/contact" className="dropdown-item" onClick={closeMenu}>
                Contact
              </Link>
            </div>
          </div>

          {/* Conditional rendering based on authentication status */}
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive("/dashboard") ? "active" : ""}`} 
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="nav-button secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive("/login") ? "active" : ""}`} onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="nav-button" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>

        <div className={`nav-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar