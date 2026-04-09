import { Link } from "react-router-dom"
import "../styles/footer.css"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Muturu Cattle Initiative</h3>
          <div className="ptag">Advancing livestock genetics and sustainable cattle farming across West Africa.</div>
          <div className="social-icons">
            <a href="https://facebook.com/mcrn" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com/mcrn" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com/mcrn" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com/company/mcrn" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link to="/about">About Us</Link>
            <Link to="/research">Research</Link>
            <Link to="/publications">Publications</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>


        <div className="footer-section">
          <h4>Contact Info</h4>
          <div className="footer-contact-info">
            <p>
              <FaEnvelope className="contact-icon" />
              <a href="mailto:muturucattleinitiative@gmail.com">muturucattleinitiative@gmail.com</a>
            </p>
            <p>
              <FaPhone className="contact-icon" />
              <a href="tel:+2348150420699">+2348150420699</a>
            </p>
            <p>PMB1515, Kwara, Nigeria</p>
            <p>P.M.B 1515, Lagos</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} Muturu Cattle Initiative. All rights reserved.</p>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer