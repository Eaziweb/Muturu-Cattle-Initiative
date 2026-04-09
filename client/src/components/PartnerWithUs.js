import { Link } from "react-router-dom"
import "../styles/PartnerWithUs.css"

const PartnerWithUs = () => {
  return (
    <section className="partner-with-us">
      <div className="decorative-shape"></div>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Partner With Us</h2>
          <p className="section-subtitle">
            Join us in preserving indigenous cattle breeds and advancing sustainable livestock research
          </p>
        </div>
  <div className="partner-cta">
          <div className="cta-text">
            <h3>Ready to make a difference?</h3>
            <p>Join our network of partners committed to sustainable livestock research</p>
          </div>
          <div className="cta-buttons">
            <Link to="/partnership" className="partner-btn primary">
              Apply for Partnership
            </Link>
            <Link to="/contact" className="partner-btn secondary">
              Contact Us
            </Link>
          </div>
        </div>
        
        <div className="partner-benefits">
          <div className="benefit-card">
            <div className="benefit-icon research">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Research Collaboration</h3>
            <p>Access to our network of 74+ scientists and cutting-edge research facilities</p>
            <div className="card-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon knowledge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3>Knowledge Sharing</h3>
            <p>Participate in workshops, conferences, and training programs</p>
            <div className="card-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon resources">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3>Resource Access</h3>
            <p>Utilize our genetic database and research publications</p>
            <div className="card-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div className="partner-types">
          <div className="types-header">
            <h3>Partnership Opportunities</h3>
            <div className="header-line"></div>
          </div>
          <div className="types-grid">
            <div className="type-item">
              <div className="type-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span>Academic Institutions</span>
            </div>
            <div className="type-item">
              <div className="type-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span>Research Organizations</span>
            </div>
            <div className="type-item">
              <div className="type-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span>Government Agencies</span>
            </div>
            <div className="type-item">
              <div className="type-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span>NGOs & Foundations</span>
            </div>
            <div className="type-item">
              <div className="type-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span>Private Sector</span>
            </div>
            <div className="type-item">
              <div className="type-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span>International Organizations</span>
            </div>
          </div>
        </div>

       
      </div>
    </section>
  )
}

export default PartnerWithUs