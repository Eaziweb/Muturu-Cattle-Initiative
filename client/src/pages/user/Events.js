"use client"

import { useState, useEffect } from "react"
import api from "../../utils/api"
import "../../styles/Events.module.css"
import Navbar from "../../components/NavBar"
import { FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa"

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await api.get("/events")
      setEvents(response.data)
    } catch (error) {
      setError("Failed to fetch events")
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const openEventModal = (event) => {
    setSelectedEvent(event)
  }

  const closeEventModal = () => {
    setSelectedEvent(null)
  }

  const getImageUrl = (flyer) => {
    if (!flyer) return "/images/event-placeholder.jpg"

    if (typeof flyer === "object" && flyer.url) {
      return flyer.url
    }

    return flyer
  }

  if (loading)
    return (
      <div className="loading-container">
        <div className="loadingSpinner"></div>
        <p>Loading events...</p>
      </div>
    )
  if (error) return <div className="error-container">{error}</div>

  return (
    <div className="events-page">
      <Navbar />

      <div className="events-hero">
        <h1>Upcoming Events</h1>
        <p>
          Join us for conferences, workshops, and seminars on Muturu cattle research and sustainable livestock
          development
        </p>
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <h3>No events available at the moment</h3>
          <p>Check back later for upcoming events!</p>
        </div>
      ) : (
        <div className="events-container">
          {events.map((event) => (
            <div key={event._id} className="event-card" onClick={() => openEventModal(event)}>
              <div className="event-image-wrapper">
                <img src={getImageUrl(event.flyer) || "/placeholder.svg"} alt={event.title} />
                <div className="event-date-badge">
                  <span className="date-day">{new Date(event.date).getDate()}</span>
                  <span className="date-month">
                    {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </div>
              </div>
              <div className="event-content">
                <h2>{event.title}</h2>
                <p className="event-theme">{event.theme}</p>
                <div className="event-meta">
                  <div className="meta-item">
                    <span className="meta-icon"><FaCalendarAlt /></span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon"><FaMapMarkerAlt /></span>
                    <span>{event.location}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon"><FaMoneyBillWave /></span>
                    <span>{event.registrationFee}</span>
                  </div>
                </div>
                <button className="view-details-btn">View Full Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className="modal-overlay" onClick={closeEventModal}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeEventModal}>
              ×
            </button>

            <div className="modal-header">
              {selectedEvent.flyer && (
                <div className="modal-image">
                  <img src={getImageUrl(selectedEvent.flyer) || "/placeholder.svg"} alt={selectedEvent.title} />
                </div>
              )}
              <div className="modal-title-section">
                <h2>{selectedEvent.title}</h2>
                <p className="modal-theme">{selectedEvent.theme}</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-info-grid">
                <div className="info-card">
                  <span className="info-icon"><FaCalendarAlt /></span>
                  <div>
                    <h4>Date</h4>
                    <p>{formatDate(selectedEvent.date)}</p>
                  </div>
                </div>
                <div className="info-card">
                  <span className="info-icon"><FaMapMarkerAlt /></span>
                  <div>
                    <h4>Location</h4>
                    <p>{selectedEvent.location}</p>
                  </div>
                </div>
                <div className="info-card">
                  <span className="info-icon"><FaMoneyBillWave /></span>
                  <div>
                    <h4>Registration Fee</h4>
                    <p>{selectedEvent.registrationFee}</p>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>About This Event</h3>
                <p>{selectedEvent.description}</p>
              </div>

              {selectedEvent.objectives && selectedEvent.objectives.length > 0 && (
                <div className="modal-section">
                  <h3>Event Objectives</h3>
                  <ul className="objectives-list">
                    {selectedEvent.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedEvent.callForAbstracts && (
                <div className="modal-section call-for-abstracts">
                  <h3>Call for Abstracts</h3>
                  <p>We invite researchers to submit abstracts for presentation at this event.</p>
                  <p>
                    <strong>Submission Deadline:</strong> {formatDate(selectedEvent.abstractDeadline)}
                  </p>
                </div>
              )}

              {selectedEvent.accountDetails && selectedEvent.accountDetails.bankName && (
                <div className="modal-section payment-details">
                  <h3>Payment Information</h3>
                  <div className="payment-info-grid">
                    <div className="payment-item">
                      <strong>Bank Name:</strong>
                      <span>{selectedEvent.accountDetails.bankName}</span>
                    </div>
                    <div className="payment-item">
                      <strong>Account Number:</strong>
                      <span>{selectedEvent.accountDetails.accountNumber}</span>
                    </div>
                    <div className="payment-item">
                      <strong>Account Name:</strong>
                      <span>{selectedEvent.accountDetails.accountName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Events