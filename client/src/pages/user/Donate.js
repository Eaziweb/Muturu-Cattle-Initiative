"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../utils/api"
import "../../styles/donate.css"
import Navbar from "../../components/NavBar"
import { FaLock, FaCreditCard, FaEnvelope, FaTrophy } from "react-icons/fa"

const Donate = () => {
  const navigate = useNavigate()

  const [donationForm, setDonationForm] = useState({
    amount: "",
    customAmount: "",
    purpose: "general",
    name: "",
    email: "",
    phone: "",
    message: "",
    anonymous: false,
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const predefinedAmounts = [5000, 10000, 25000, 50000, 100000, 250000]

  const purposes = [
    { value: "general", label: "General Support" },
    { value: "research", label: "Research Projects" },
    { value: "training", label: "Farmer Training" },
    { value: "equipment", label: "Equipment & Infrastructure" },
    { value: "conservation", label: "Breed Conservation" },
    { value: "education", label: "Educational Programs" },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setDonationForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleAmountSelect = (amount) => {
    setDonationForm((prev) => ({
      ...prev,
      amount: amount.toString(),
      customAmount: "",
    }))
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }))
    }
  }

  const handleCustomAmountChange = (e) => {
    const value = e.target.value
    setDonationForm((prev) => ({
      ...prev,
      customAmount: value,
      amount: value,
    }))
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    const finalAmount = Number.parseFloat(donationForm.amount || donationForm.customAmount || 0)
    if (!finalAmount || finalAmount < 100) {
      newErrors.amount = "Minimum donation amount is ₦100"
    }

    if (!donationForm.anonymous) {
      if (!donationForm.name.trim()) newErrors.name = "Name is required"
    }
    if (!donationForm.email.trim()) newErrors.email = "Email is required"
    if (!donationForm.phone.trim()) newErrors.phone = "Phone number is required"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (donationForm.email && !emailRegex.test(donationForm.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const finalAmount = Number.parseFloat(donationForm.amount || donationForm.customAmount)

      const payload = {
        amount: finalAmount,
        email: donationForm.email,
        name: donationForm.anonymous ? "Anonymous Donor" : donationForm.name,
        phone: donationForm.phone,
        purpose: donationForm.purpose,
        message: donationForm.message,
        anonymous: donationForm.anonymous,
      }

      const response = await api.post("/donations/initialize", payload)

      if (response.data.status === "success") {
        localStorage.setItem(
          "pendingDonation",
          JSON.stringify({
            transactionId: response.data.data.transactionId,
            amount: finalAmount,
            purpose: donationForm.purpose,
          }),
        )

        window.location.href = response.data.data.link
      } else {
        setErrors({ general: "Failed to initialize payment. Please try again." })
      }
    } catch (error) {
      console.error("Donation error:", error)
      setErrors({
        general: error.response?.data?.message || "An error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="donate-section">
      <Navbar />
      <div className="donate-page">
        <div className="donate-header">
          <h1>Support Our Mission</h1>
          <p>
            Your donation helps us advance sustainable agriculture and preserve indigenous Muturu cattle breeds across
            West Africa
          </p>
        </div>

        <div className="donate-container">
          <div className="donate-form-section">
            {errors.general && <div className="error-message">{errors.general}</div>}

            <form onSubmit={handleSubmit} className="donate-form">
              <div className="form-section">
                <h3>Donation Amount</h3>
                <div className="amount-options">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className={`amount-btn ${donationForm.amount === amount.toString() ? "selected" : ""}`}
                      onClick={() => handleAmountSelect(amount)}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
                <div className="custom-amount">
                  <label htmlFor="customAmount">Or enter custom amount (₦)</label>
                  <input
                    type="number"
                    id="customAmount"
                    name="customAmount"
                    value={donationForm.customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter amount"
                    min="100"
                    className={errors.amount ? "error" : ""}
                  />
                  {errors.amount && <span className="error-text">{errors.amount}</span>}
                </div>
              </div>

              <div className="form-section">
                <h3>Donation Purpose</h3>
                <select name="purpose" value={donationForm.purpose} onChange={handleInputChange} required>
                  {purposes.map((purpose) => (
                    <option key={purpose.value} value={purpose.value}>
                      {purpose.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <h3>Your Information</h3>
                <div className="form-row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={donationForm.name}
                    onChange={handleInputChange}
                    required={!donationForm.anonymous}
                    className={errors.name ? "error" : ""}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={donationForm.email}
                    onChange={handleInputChange}
                    required
                    className={errors.email ? "error" : ""}
                  />
                </div>
                {errors.name && <span className="error-text">{errors.name}</span>}
                {errors.email && <span className="error-text">{errors.email}</span>}

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={donationForm.phone}
                  onChange={handleInputChange}
                  required
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="anonymous"
                      checked={donationForm.anonymous}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Make this donation anonymous
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Message (Optional)</h3>
                <textarea
                  name="message"
                  placeholder="Leave a message or specify how you'd like your donation to be used..."
                  value={donationForm.message}
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>
              </div>

              <button type="submit" className="donate-btn" disabled={loading}>
                {loading
                  ? "Processing..."
                  : `Donate ${
                      donationForm.amount || donationForm.customAmount
                        ? formatCurrency(Number.parseFloat(donationForm.amount || donationForm.customAmount || 0))
                        : ""
                    }`}
              </button>
            </form>
          </div>

          <div className="donate-info-section">
            <div className="impact-card">
              <h3>Your Impact</h3>
              <div className="impact-items">
                <div className="impact-item">
                  <span className="impact-amount">₦5,000</span>
                  <span className="impact-description">Provides training materials for 5 farmers</span>
                </div>
                <div className="impact-item">
                  <span className="impact-amount">₦15,000</span>
                  <span className="impact-description">Funds genetic testing for 10 cattle</span>
                </div>
                <div className="impact-item">
                  <span className="impact-amount">₦50,000</span>
                  <span className="impact-description">Supports a month of research activities</span>
                </div>
                <div className="impact-item">
                  <span className="impact-amount">₦100,000</span>
                  <span className="impact-description">Sponsors a community workshop</span>
                </div>
              </div>
            </div>

            <div className="security-card">
              <h3>Secure Donation</h3>
              <div className="security-features">
                <div className="security-item">
                  <FaLock className="security-icon" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="security-item">
                  <FaCreditCard className="security-icon" />
                  <span>Flutterwave Secured</span>
                </div>
                <div className="security-item">
                  <FaEnvelope className="security-icon" />
                  <span>Email Receipt</span>
                </div>
                <div className="security-item">
                  <FaTrophy className="security-icon" />
                  <span>Tax Deductible</span>
                </div>
              </div>
            </div>

            <div className="contact-card">
              <h3>Questions?</h3>
              <p>Contact our team for more information about donations and how your contribution makes a difference.</p>
              <div className="contact-info">
                <p>
                  <strong>Email:</strong> muturucattleinitiative@gmail.com
                </p>
                <p>
                  <strong>Phone:</strong> +2348150420699
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Donate