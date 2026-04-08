import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NewsroomSection from "../../components/NewsroomSection";
import PartnerWithUs from "../../components/PartnerWithUs";
import PartnerSlider from "../../components/PartnerSlider";
import Navbar from "../../components/NavBar";
import MuturuSectionSection from "../../components/MuturuCattleSection";
import "../../styles/home.css";

// Separate Skeleton Component for a cleaner main component
const HomeSkeleton = () => (
  <div className="home">
    <div className="skeleton skeleton-hero"></div>
    <div className="container section">
      <div className="skeleton skeleton-title-center"></div>
      <div className="about-grid">
        <div className="skeleton skeleton-img-box"></div>
        <div className="about-text">
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line" style={{ width: '80%' }}></div>
          <div className="skeleton skeleton-line" style={{ width: '40%', height: '45px', marginTop: '20px' }}></div>
        </div>
      </div>
    </div>
    <div className="container section">
      <div className="skeleton skeleton-title-center"></div>
      <div className="research-grid">
        <div className="skeleton skeleton-card-box"></div>
        <div className="skeleton skeleton-card-box"></div>
        <div className="skeleton skeleton-card-box"></div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This simulates the time it takes to fetch data or load heavy images
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <HomeSkeleton />
      </>
    );
  }

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
      <section className="section home-impact-section">
        <div className="container">
          <h2 className="section-title">Our Impact</h2>
          <div className="home-impact-grid">
            <div className="home-impact-card">
              <div className="home-impact-number">74</div>
              <div className="home-impact-label">Research Scientists</div>
            </div>
            <div className="home-impact-card">
              <div className="home-impact-number">3</div>
              <div className="home-impact-label">Countries</div>
            </div>
            <div className="home-impact-card">
              <div className="home-impact-number">50</div>
              <div className="home-impact-label">Research Projects</div>
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
              <p>To be the leading research network for indigenous cattle conservation and sustainable livestock development in West Africa.</p>
            </div>
            <div className="mission-card">
              <h3>Mission</h3>
              <p>To conduct cutting-edge research and empower farmers with knowledge to preserve this breed for future generations.</p>
            </div>
            <div className="mission-card">
              <h3>Objectives</h3>
              <p>Advance understanding of genetics • Build capacity • Promote sustainable practices • Preserve resources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="section partnership-section">
        <div className="container">
          <h2 className="section-title">Our Partners</h2>
          <p className="section-subtitle">Collaborating with leading institutions across West Africa</p>
          <PartnerSlider />
        </div>
      </section>

      <MuturuSectionSection />

      <PartnerWithUs />

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="home_h2">Join Our Research Network</h2>
            <p className="home_p">
              Be part of the largest species-based research network in Sub-Saharan Africa. 
              Collaborate with leading scientists today.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">Become a Member</Link>
              <Link to="/donate" className="cta-btn secondary">Support Our Work</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;