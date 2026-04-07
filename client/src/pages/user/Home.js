import { Link } from "react-router-dom"
import NewsroomSection from "../../components/NewsroomSection"
import PartnerWithUs from "../../components/PartnerWithUs"
import PartnerSlider from "../../components/PartnerSlider" // Import the new component
import "../../styles/home.css"
import Navbar from "../../components/NavBar"
import MuturuSectionSection from "../../components/MuturuCattleSection"


const Home = () => {
  return (
    
    <div className="home">
       <Navbar />
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>Muturu Cattle Research Network</h1>
          <p>Preserving indigenous cattle breeds and advancing sustainable livestock genetics across West Africa</p>
          <Link to="/register" className="hero-btn">
            Join Our Network
          </Link>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section about-preview">
        <div className="container">
          <h2 className="section-title">Who We Are</h2>
          <div className="about-grid">
            <div className="about-image">
              <img src="/muturucattle.jpg" alt="Muturu Cattle" />
            </div>
            <div className="about-text">
              <p>
                The Muturu Cattle Research Network comprises 74 scientists across research stations and academic
                institutions in Nigeria, Ghana, and Benin Republic. We are the largest species-based research network in
                Sub-Saharan Africa, dedicated to preserving and improving the Muturu cattle breed.
              </p>
              <p>
                Our network focuses on genetic conservation, sustainable breeding practices, and empowering local
                farmers with knowledge and resources to maintain this valuable indigenous breed.
              </p>
              <Link to="/about" className="learn-more-btn">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Research Focus Section */}
      <section className="section research-focus">
        <div className="container">
          <h2 className="section-title">Our Research Focus</h2>
          <div className="research-grid">
            <div className="research-card">
              <div className="research-image">
                <img src="/genetic-research.jpg" alt="Genetic Research" />
              </div>
              <h3>Genetic Conservation</h3>
              <p>Preserving the unique genetic traits of Muturu cattle for future generations</p>
            </div>
            <div className="research-card">
              <div className="research-image">
                <img src="/breeding.jpg" alt="Breeding Programs" />
              </div>
              <h3>Breeding Programs</h3>
              <p>Developing sustainable breeding strategies to improve herd quality and productivity</p>
            </div>
            <div className="research-card">
              <div className="research-image">
                <img src="/health.jpg" alt="Animal Health" />
              </div>
              <h3>Disease Resistance</h3>
              <p>Studying the natural disease resistance of Muturu cattle in tropical environments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section impact-section">
        <div className="container">
          <h2 className="section-title">Our Impact</h2>
          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-number">74+</div>
              <div className="impact-label">Research Scientists</div>
            </div>
            <div className="impact-card">
              <div className="impact-number">3</div>
              <div className="impact-label">Countries</div>
            </div>
            <div className="impact-card">
              <div className="impact-number">50+</div>
              <div className="impact-label">Research Projects</div>
            </div>
            <div className="impact-card">
              <div className="impact-number">5000+</div>
              <div className="impact-label">Farmers Supported</div>
            </div>
          </div>
        </div>
      </section>

      <NewsroomSection />

      {/* Mission & Vision Section */}
      <section className="section mission-section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <h3>Vision</h3>
              <p>
                To be the leading research network for indigenous cattle conservation and sustainable livestock
                development in West Africa, ensuring food security and economic prosperity for rural communities.
              </p>
            </div>
            <div className="mission-card">
              <h3>Mission</h3>
              <p>
                To conduct cutting-edge research on Muturu cattle genetics, promote sustainable breeding practices, and
                empower farmers with knowledge and resources to preserve this valuable indigenous breed for future
                generations.
              </p>
            </div>
            <div className="mission-card">
              <h3>Objectives</h3>
              <p>
                Advance scientific understanding of Muturu cattle genetics • Build capacity among researchers and
                farmers • Promote sustainable livestock practices • Preserve indigenous genetic resources
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section with Slider */}
      <section className="section partnership-section">
        <div className="container">
          <h2 className="section-title">Our Partners</h2>
          <p className="section-subtitle">Collaborating with leading institutions across West Africa</p>
          <PartnerSlider />
        </div>
      </section>
<MuturuSectionSection/>
      {/* Partner With Us Section */}
      <PartnerWithUs />

      {/* Call to Action Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="home_h2">Join Our Research Network</div>
           <div className="home_p">
              Be part of the largest species-based research network in Sub-Saharan Africa. Collaborate with leading
              scientists and contribute to preserving indigenous cattle breeds.
      </div>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">
                Become a Member
              </Link>
              <Link to="/donate" className="cta-btn secondary">
                Support Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home