import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/logo.css"

const CattleIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 3C9.5 3 7 4.5 6 7L3 13h3l1.5-3c0.5 2.5 2.5 4 4.5 4s4-1.5 4.5-4L18 13h3L18 7c-1-2.5-3.5-4-6-4z"
      fill="rgba(255,255,255,0.92)"
    />
    <circle cx="9" cy="9" r="1.2" fill="#7de89a" />
    <circle cx="15" cy="9" r="1.2" fill="#7de89a" />
    <path
      d="M8 17 Q12 21 16 17"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
)

const Logo = () => {
  const [active, setActive] = useState(false)

  return (
    <Link
      to="/"
      className={`mcrn-logo${active ? " mcrn-logo--active" : ""}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      aria-label="MCRN Management System — home"
    >
      <div className="mcrn-logo__icon">
        <CattleIcon size={24} />
      </div>

      <div className="mcrn-logo__divider" aria-hidden="true" />

      <div className="mcrn-logo__text">
        <span className="mcrn-logo__wordmark">MCNI</span>
      </div>

      <div className="mcrn-logo__shine" aria-hidden="true" />
    </Link>
  )
}

export default Logo