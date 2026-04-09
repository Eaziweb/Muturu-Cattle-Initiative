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
<p> The global livestock industry is increasingly dominated by a few highly productive breeds, leading to the decline or replacement of local breeds through crossbreeding and genetic absorption. This trend threatens Africa’s largely untapped livestock genetic resources and poses risks to food security and sustainable livelihoods in Sub-Saharan Africa.

Muturu cattle, a unique indigenous taurine breed of West Africa, were once prominent in Nigeria, Benin, and Ghana. These small-sized cattle are valued for their hardiness, disease resistance, short generation interval, and adaptability to humid forest environments. They represent a vital genetic resource shaped by centuries of natural selection and traditional practices. However, their population has significantly declined due to factors such as preference for breeds like White Fulani, crossbreeding, habitat loss, and changing agricultural systems.

</p> <p> There is an urgent need for increased advocacy, policy support, research, and stakeholder collaboration to preserve and promote Muturu cattle and other indigenous livestock breeds for sustainable livestock development in Africa. </p>
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