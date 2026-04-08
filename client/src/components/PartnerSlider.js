"use client"

import { useState, useEffect } from "react"
import api from "../utils/api" // Using your axios utility
import styles from "../styles/PartnerSlider.module.css"

const PartnerSlider = () => {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      // Hits http://localhost:5000/api/partners via your axios config
      const response = await api.get("/partners")
      setPartners(response.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching partners:", err)
      setError("Failed to load partners")
    } finally {
      setLoading(false)
    }
  }

  // Helper to handle image URLs (same logic as your Newsroom section)
  const getLogoUrl = (logo) => {
    if (!logo) return null
    if (typeof logo === "object" && logo.url) return logo.url
    return logo
  }

  if (loading) {
    return (
      <div className={styles.partnerSlider}>
        <div className={styles.loading}>Loading partners...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.partnerSlider}>
        <div className={styles.error}>
          {error} <button onClick={fetchPartners} className={styles.retryBtn}>Retry</button>
        </div>
      </div>
    )
  }

  if (!partners || partners.length === 0) {
    return null
  }

  // Duplicate partners for seamless loop
  const duplicatedPartners = [...partners, ...partners]

  return (
    <div className={styles.partnerSlider}>
      <div className={styles.sliderTrack}>
        {duplicatedPartners.map((partner, index) => (
          <div key={`${partner._id}-${index}`} className={styles.slide}>
            {partner.logo ? (
              <img 
                src={getLogoUrl(partner.logo)} 
                alt={partner.name} 
                className={styles.partnerLogo}
                onError={(e) => {
                  e.target.style.display = 'none'; // Hide broken images
                  e.target.nextSibling.style.display = 'block'; // Show text fallback
                }}
              />
            ) : null}
            
            {/* Fallback name if logo is missing or fails to load */}
            <span className={styles.partnerName} style={{ display: partner.logo ? 'none' : 'block' }}>
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PartnerSlider