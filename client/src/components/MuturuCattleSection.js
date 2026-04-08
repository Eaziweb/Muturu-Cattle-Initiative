import React from "react"
import { Link } from "react-router-dom"
import "../styles/muturusection.css"
import { FaDna, FaLandmark, FaFlask, FaBook, FaArrowRight } from "react-icons/fa"

const MuturuCattleSection = () => {
  return (
    <section className="muturu-cattle-section">
      <div className="container">
        <div className="section-header">
          <h2>Muturu Cattle Research</h2>
          <p>Preserving Nigeria's Indigenous Livestock Heritage</p>
          <div className="header-underline"></div>
        </div>

        <div className="muturu-content">
          <div className="muturu-intro">
            <div className="intro-text">
              <h3>About Muturu Cattle</h3>
              <p>
                The Muturu cattle are a unique indigenous breed of West Africa, particularly found in Nigeria. These
                small-sized cattle are known for their hardiness, disease resistance, and adaptation to the humid forest
                zones of West Africa. They represent an important genetic resource that has been shaped by centuries of
                natural selection and traditional management practices.
              </p>
              <p>
                Despite their valuable traits, Muturu cattle populations have been declining due to various factors
                including crossbreeding with exotic breeds, habitat loss, and changing agricultural practices.
                Conservation efforts are crucial to preserve this important genetic resource for future generations.
              </p>
              <Link to="/muturu-cattle" className="learn-more-btn">
                Learn More <FaArrowRight />
              </Link>
            </div>
            <div className="intro-image">
              <div className="image-container">
                <img src="muturu.jpeg" alt="Muturu cattle grazing" className="muturu-img" />
              </div>
            </div>
          </div>
    

          <div className="muturu-cta">
            <h3>Join Our Conservation Efforts</h3>
            <p>
              Help us preserve this valuable genetic resource for future generations. Your support can make a difference
              in conserving Nigeria's indigenous livestock heritage.
            </p>
            <div className="cta-buttons">
              <Link to="/membership" className="cta-btn primary">
                Become a Member
              </Link>
              <Link to="/donate" className="cta-btn secondary">
                Support Conservation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MuturuCattleSection