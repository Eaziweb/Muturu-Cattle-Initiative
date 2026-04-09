"use client"

import { useState, useEffect } from "react"
import api from "../../utils/api"
import styles from "../../styles/Events.module.css"
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
      console.log("Full events data:", response.data)
      // Log the flyer structure for the first event to debug
      if (response.data && response.data.length > 0) {
        console.log("First event flyer structure:", response.data[0].flyer)
      }
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
    // Debug logging
    console.log("getImageUrl received:", flyer)
    
    if (!flyer) {
      console.log("No flyer provided, using placeholder")
      return "/images/event-placeholder.jpg"
    }

    // If flyer is an object with url property (Cloudinary format)
    if (typeof flyer === "object" && flyer.url) {
      console.log("Using Cloudinary URL:", flyer.url)
      return flyer.url
    }

    // If flyer is a string
    if (typeof flyer === "string") {
      // Check if it's a full URL (Cloudinary usually returns full URLs)
      if (flyer.startsWith('http://') || flyer.startsWith('https://')) {
        console.log("Using full URL string:", flyer)
        return flyer
      }
      // If it's a relative path
      console.log("Using relative path:", flyer)
      return flyer.startsWith('/') ? flyer : `/${flyer}`
    }

    console.log("Unknown flyer format, using placeholder")
    return "/images/event-placeholder.jpg"
  }

  if (loading)
    return (
      <div className={styles["loading-container"]}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading events...</p>
      </div>
    )
  if (error) return <div className={styles["error-container"]}>{error}</div>

  return (
    <div className={styles["events-page"]}>
      <Navbar />

      <div className={styles["events-hero"]}>
        <h1>Upcoming Events</h1>
        <p>
          Join us for conferences, workshops, and seminars on Muturu cattle research and sustainable livestock
          development
        </p>
      </div>

      {events.length === 0 ? (
        <div className={styles["no-events"]}>
          <h3>No events available at the moment</h3>
          <p>Check back later for upcoming events!</p>
        </div>
      ) : (
        <div className={styles["events-container"]}>
          {events.map((event) => (
            <div key={event._id} className={styles["event-card"]} onClick={() => openEventModal(event)}>
              <div className={styles["event-image-wrapper"]}>
                <img 
                  src={getImageUrl(event.flyer)} 
                  alt={event.title}
                  onError={(e) => {
                    console.error(`Failed to load image for event "${event.title}":`, e.target.src)
                    console.log("Flyer data was:", event.flyer)
                    e.target.onerror = null
                    e.target.src = "/images/event-placeholder.jpg"
                  }}
                  onLoad={() => console.log(`Successfully loaded image for event: ${event.title}`)}
                />
                <div className={styles["event-date-badge"]}>
                  <span className={styles["date-day"]}>{new Date(event.date).getDate()}</span>
                  <span className={styles["date-month"]}>
                    {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </div>
              </div>
              <div className={styles["event-content"]}>
                <h2>{event.title}</h2>
                <p className={styles["event-theme"]}>{event.theme}</p>
                <div className={styles["event-meta"]}>
                  <div className={styles["meta-item"]}>
                    <span className={styles["meta-icon"]}><FaCalendarAlt /></span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className={styles["meta-item"]}>
                    <span className={styles["meta-icon"]}><FaMapMarkerAlt /></span>
                    <span>{event.location}</span>
                  </div>
                  <div className={styles["meta-item"]}>
                    <span className={styles["meta-icon"]}><FaMoneyBillWave /></span>
                    <span>{event.registrationFee}</span>
                  </div>
                </div>
                <button className={styles["view-details-btn"]}>View Full Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className={styles["modal-overlay"]} onClick={closeEventModal}>
          <div className={styles["event-modal"]} onClick={(e) => e.stopPropagation()}>
            <button className={styles["close-modal"]} onClick={closeEventModal}>
              ×
            </button>

            <div className={styles["modal-header"]}>
              {selectedEvent.flyer && (
                <div className={styles["modal-image"]}>
                  <img 
                    src={getImageUrl(selectedEvent.flyer)} 
                    alt={selectedEvent.title}
                    onError={(e) => {
                      console.error("Modal image failed to load:", e.target.src)
                      e.target.onerror = null
                      e.target.src = "/images/event-placeholder.jpg"
                    }}
                  />
                </div>
              )}
              <div className={styles["modal-title-section"]}>
                <h2>{selectedEvent.title}</h2>
                <p className={styles["modal-theme"]}>{selectedEvent.theme}</p>
              </div>
            </div>

            <div className={styles["modal-body"]}>
              <div className={styles["modal-info-grid"]}>
                <div className={styles["info-card"]}>
                  <span className={styles["info-icon"]}><FaCalendarAlt /></span>
                  <div>
                    <h4>Date</h4>
                    <p>{formatDate(selectedEvent.date)}</p>
                  </div>
                </div>
                <div className={styles["info-card"]}>
                  <span className={styles["info-icon"]}><FaMapMarkerAlt /></span>
                  <div>
                    <h4>Location</h4>
                    <p>{selectedEvent.location}</p>
                  </div>
                </div>
                <div className={styles["info-card"]}>
                  <span className={styles["info-icon"]}><FaMoneyBillWave /></span>
                  <div>
                    <h4>Registration Fee</h4>
                    <p>{selectedEvent.registrationFee}</p>
                  </div>
                </div>
              </div>

              <div className={styles["modal-section"]}>
                <h3>About This Event</h3>
                <p>{selectedEvent.description}</p>
              </div>

              {selectedEvent.objectives && selectedEvent.objectives.length > 0 && (
                <div className={styles["modal-section"]}>
                  <h3>Event Objectives</h3>
                  <ul className={styles["objectives-list"]}>
                    {selectedEvent.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedEvent.callForAbstracts && (
                <div className={`${styles["modal-section"]} ${styles["call-for-abstracts"]}`}>
                  <h3>Call for Abstracts</h3>
                  <p>We invite researchers to submit abstracts for presentation at this event.</p>
                  <p>
                    <strong>Submission Deadline:</strong> {formatDate(selectedEvent.abstractDeadline)}
                  </p>
                </div>
              )}

              {selectedEvent.accountDetails && selectedEvent.accountDetails.bankName && (
                <div className={`${styles["modal-section"]} ${styles["payment-details"]}`}>
                  <h3>Payment Information</h3>
                  <div className={styles["payment-info-grid"]}>
                    <div className={styles["payment-item"]}>
                      <strong>Bank Name:</strong>
                      <span>{selectedEvent.accountDetails.bankName}</span>
                    </div>
                    <div className={styles["payment-item"]}>
                      <strong>Account Number:</strong>
                      <span>{selectedEvent.accountDetails.accountNumber}</span>
                    </div>
                    <div className={styles["payment-item"]}>
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