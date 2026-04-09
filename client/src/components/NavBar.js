"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Handle scroll effect for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
    setIsUpdatesOpen(false);
    document.body.style.overflow = "unset";
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
    setIsUpdatesOpen(false);
    document.body.style.overflow = "unset";
  };

  const toggleResources = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResourcesOpen(!isResourcesOpen);
    setIsUpdatesOpen(false);
  };

  const toggleUpdates = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUpdatesOpen(!isUpdatesOpen);
    setIsResourcesOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className={`mci-nav ${isScrolled ? "mci-nav--scrolled" : ""}`}>
      <div className="mci-nav__container">
        {/* Logo */}
        <Link to="/" className="mci-nav__logo-link" onClick={closeMenu}>
          <div className="mci-nav__logo-box">MCI</div>
        </Link>

        {/* Desktop & Mobile Menu */}
        <div className={`mci-nav__menu ${isMenuOpen ? "mci-nav__menu--open" : ""}`}>
          {/* Home Link */}
          <Link
            to="/"
            className={`mci-nav__link ${isActive("/") ? "mci-nav__link--active" : ""}`}
            onClick={closeMenu}
          >
            Home
          </Link>

          {/* About Link */}
          <Link
            to="/about"
            className={`mci-nav__link ${isActive("/about") ? "mci-nav__link--active" : ""}`}
            onClick={closeMenu}
          >
            About
          </Link>

          {/* Muturu Cattle Link */}
          <Link
            to="/muturu-cattle"
            className={`mci-nav__link ${isActive("/muturu-cattle") ? "mci-nav__link--active" : ""}`}
            onClick={closeMenu}
          >
            Muturu Cattle Research
          </Link>

          {/* Members Link */}
          <Link
            to="/members"
            className={`mci-nav__link ${isActive("/members") ? "mci-nav__link--active" : ""}`}
            onClick={closeMenu}
          >
            Find Members
          </Link>

          {/* Donate Link */}
          <Link
            to="/donate"
            className={`mci-nav__link ${isActive("/donate") ? "mci-nav__link--active" : ""}`}
            onClick={closeMenu}
          >
            Donate
          </Link>

          {/* Resources Dropdown */}
          <div className="mci-nav__dropdown">
            <div
              className={`mci-nav__dropdown-toggle ${
                isActive("/publications") || isActive("/journals")
                  ? "mci-nav__dropdown-toggle--active"
                  : ""
              }`}
              onClick={toggleResources}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && toggleResources(e)}
            >
              Resources
              <span
                className={`mci-nav__dropdown-arrow ${
                  isResourcesOpen ? "mci-nav__dropdown-arrow--open" : ""
                }`}
              >
                ▼
              </span>
            </div>
            <div
              className={`mci-nav__dropdown-menu ${
                isResourcesOpen ? "mci-nav__dropdown-menu--mobile-open" : ""
              }`}
            >
              <Link to="/publications" className="mci-nav__dropdown-item" onClick={closeMenu}>
                Publications
              </Link>
              <Link to="/journals" className="mci-nav__dropdown-item" onClick={closeMenu}>
                Journals
              </Link>
            </div>
          </div>

          {/* Updates Dropdown */}
          <div className="mci-nav__dropdown">
            <div
              className={`mci-nav__dropdown-toggle ${
                isActive("/blogs") ||
                isActive("/announcements") ||
                isActive("/gallery") ||
                isActive("/events") ||
                isActive("/contact")
                  ? "mci-nav__dropdown-toggle--active"
                  : ""
              }`}
              onClick={toggleUpdates}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && toggleUpdates(e)}
            >
              Updates
              <span
                className={`mci-nav__dropdown-arrow ${
                  isUpdatesOpen ? "mci-nav__dropdown-arrow--open" : ""
                }`}
              >
                ▼
              </span>
            </div>
            <div
              className={`mci-nav__dropdown-menu ${
                isUpdatesOpen ? "mci-nav__dropdown-menu--mobile-open" : ""
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <Link to="/blogs" className="mci-nav__dropdown-item" onClick={closeMenu}>
                Blog
              </Link>
              <Link to="/announcements" className="mci-nav__dropdown-item" onClick={closeMenu}>
                Announcements
              </Link>
              <Link to="/gallery" className="mci-nav__dropdown-item" onClick={closeMenu}>
                Gallery
              </Link>
              <Link to="/events" className="mci-nav__dropdown-item" onClick={closeMenu}>
                Events
              </Link>
              <Link to="/contact" className="mci-nav__dropdown-item" onClick={closeMenu}>
                Contact
              </Link>
            </div>
          </div>

          {/* Conditional Auth Links */}
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`mci-nav__link ${isActive("/dashboard") ? "mci-nav__link--active" : ""}`}
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="mci-nav__button mci-nav__button--secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`mci-nav__link ${isActive("/login") ? "mci-nav__link--active" : ""}`}
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link to="/register" className="mci-nav__button" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Toggle */}
        <div
          className={`mci-nav__toggle ${isMenuOpen ? "mci-nav__toggle--open" : ""}`}
          onClick={toggleMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && toggleMenu(e)}
        >
          <span className="mci-nav__toggle-bar"></span>
          <span className="mci-nav__toggle-bar"></span>
          <span className="mci-nav__toggle-bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;