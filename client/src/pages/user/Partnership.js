"use client"

import { useState } from "react"
import api from "../../utils/api"
import "../../styles/partnership.css"
import Navbar from "../../components/NavBar"

const Partnership = () => {
  const [formData, setFormData] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    organizationType: "",
    partnershipType: "",
    description: "",
    website: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const organizationTypes = [
    "Research Institution",
    "University",
    "Government Agency",
    "NGO/Non-Profit",
    "Private Company",
    "International Organization",
    "Other",
  ]

  const partnershipTypes = [
    "Research Collaboration",
    "Funding Partnership",
    "Technical Support",
    "Knowledge Exchange",
    "Joint Projects",
    "Capacity Building",
    "Other",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setSuccess("")
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")

    try {
      await api.post("/partnership", formData)
      setSuccess("Partnership application submitted successfully! We will review your application and contact you within 5-7 business days.")
      setFormData({
        organizationName: "",
        contactPerson: "",
        email: "",
        phone: "",
        organizationType: "",
        partnershipType: "",
        description: "",
        website: "",
      })
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="partnership-page">
                         <Navbar />

      <div className="container">
        {/* Hero Section */}
        <div className="partnership-hero">
          <h1>Partner with MCRN</h1>
          <p>Join us in advancing cattle research and sustainable livestock development across Nigeria and beyond.</p>
        </div>

        <div className="partnership-content">
          {/* Partnership Form */}
          <div className="partnership-form-section">
            <div className="form-container">
              <h2>Partnership Application</h2>

              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit} className="partnership-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="organizationName">Organization Name *</label>
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      required
                      placeholder="Enter organization name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactPerson">Contact Person *</label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                      placeholder="Enter contact person name"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="organizationType">Organization Type *</label>
                    <select
                      id="organizationType"
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select organization type</option>
                      {organizationTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="partnershipType">Partnership Type *</label>
                    <select
                      id="partnershipType"
                      name="partnershipType"
                      value={formData.partnershipType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select partnership type</option>
                      {partnershipTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="website">Website (Optional)</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Partnership Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Describe your organization and the type of partnership you're interested in..."
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </div>
          </div>

          {/* Partnership Information */}
          <div className="partnership-info-section">
            <div className="info-container">
              <h2>Why Partner with Us?</h2>
              
              <div className="benefits-grid">
                <div className="benefit-card">
                  <h3>Research Excellence</h3>
                  <p>
                    Access to cutting-edge research facilities and expertise in cattle genetics, nutrition, and disease
                    management.
                  </p>
                </div>
                <div className="benefit-card">
                  <h3>Network Access</h3>
                  <p>Connect with leading researchers, farmers, and industry professionals across Nigeria and Africa.</p>
                </div>
                <div className="benefit-card">
                  <h3>Knowledge Sharing</h3>
                  <p>Participate in conferences, workshops, and training programs to share and gain valuable insights.</p>
                </div>
                <div className="benefit-card">
                  <h3>Impact Creation</h3>
                  <p>Contribute to sustainable livestock development and food security initiatives.</p>
                </div>
              </div>

              <div className="current-partners">
                <h3>Our Current Partners</h3>
                <div className="partners-grid">
                  <div className="partner-card">
                    <img src="/generic-university-logo.png" alt="University of Agriculture" />
                    <h4>University of Agriculture, Abeokuta</h4>
                    <p>Research Collaboration</p>
                  </div>
                  <div className="partner-card">
                    <img src="/generic-government-logo.png" alt="Federal Ministry" />
                    <h4>Federal Ministry of Agriculture</h4>
                    <p>Policy Development</p>
                  </div>
                  <div className="partner-card">
                    <img src="/international-organization-logo.jpg" alt="FAO" />
                    <h4>Food and Agriculture Organization</h4>
                    <p>Technical Support</p>
                  </div>
                  <div className="partner-card">
                    <img src="/research-institute-logo.png" alt="ILRI" />
                    <h4>International Livestock Research Institute</h4>
                    <p>Joint Research Projects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Partnership