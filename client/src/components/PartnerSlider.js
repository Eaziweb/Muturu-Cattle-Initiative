import { useState, useEffect } from "react"
import styles from "../styles/PartnerSlider.module.css"

const PartnerSlider = () => {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch("/api/partners")
        if (!response.ok) {
          throw new Error("Failed to fetch partners")
        }
        const data = await response.json()
        setPartners(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  if (loading) {
    return <div className={styles.loading}>Loading partners...</div>
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>
  }

  if (partners.length === 0) {
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
                src={partner.logo} 
                alt={partner.name} 
                className={styles.partnerLogo}
              />
            ) : (
              <span className={styles.partnerName}>{partner.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PartnerSlider