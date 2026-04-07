import { Link } from "react-router-dom"

const Logo = () => {
  const logoStyle = {
    fontSize: "20px",
    fontWeight: "800",
    fontFamily: "Segoe UI, sans-serif",
    color: "white",
    letterSpacing: "2px",
    textTransform: "uppercase",
    padding: "8px 15px",
    backgroundColor: "#006400", // very thick green
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
    display: "inline-block",
  }

  return (
    <Link to="/">
      <div style={logoStyle}>MCRN</div>
    </Link>
  )
}

export default Logo
    