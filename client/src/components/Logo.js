import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/logo.css";

const Logo = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to="/" className="logo-link">
      <div 
        className={`logo-box ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="logo-text">MCRN</span>
        <span className="logo-subtitle">Management System</span>
      </div>
    </Link>
  );
};

export default Logo;