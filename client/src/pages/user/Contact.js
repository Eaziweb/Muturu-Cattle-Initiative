"use client"

import { useState } from "react"
import "../../styles/contact.css"
import Navbar from "../../components/NavBar"
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    alert("Thank you for your message! We will get back to you soon.")
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="contact-section">
      <Navbar />
    <div className="contact-page">
      <div className="container">
        <div className="contact-hero">
          <h1>Get in Touch</h1>
          <p>Have questions about our research or want to collaborate? We'd love to hear from you.</p>
        </div>

        <div className="contact-content">
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this regarding?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>

          <div className="contact-info-section">
            <h2>Contact Information</h2>
            <div className="contact-methods">
              <div className="contact-method">
                <h3><FaEnvelope /> Email</h3>
                <p>muturucattleinitiative@gmail.com</p>
              </div>

              <div className="contact-method">
                <h3><FaPhone /> Phone</h3>
                <p>+2348150420699</p>
              </div>

              <div className="contact-method">
             
                <h3><FaMapMarkerAlt /> Address</h3>
                <p>Muturu Cattle Research Initiative</p>
                <p>Kwara, Nigeria</p>
              </div>

              <div className="contact-method">
        
                <h3><FaClock /> Office Hours</h3>
                <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Contact