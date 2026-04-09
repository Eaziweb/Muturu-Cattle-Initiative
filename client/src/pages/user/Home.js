import { Link } from "react-router-dom"
import NewsroomSection from "../../components/NewsroomSection"
import PartnerWithUs from "../../components/PartnerWithUs"
import PartnerSlider from "../../components/PartnerSlider"
import "../../styles/home.css"
import "../../styles/skeleton-animations.css"
import Navbar from "../../components/NavBar"
import MuturuSectionSection from "../../components/MuturuCattleSection"
import { useScrollAnimation, initCountUpNumbers } from "../../hooks/useScrollAnimation"
import { useEffect } from "react"

const Home = () => {
  const pageRef = useScrollAnimation()

  // Start count-up after page mounts
  useEffect(() => {
    initCountUpNumbers(document)
  }, [])

  return (
    <div className="home" ref={pageRef}>
      <Navbar />

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1 className="animate-on-scroll fade-up">Muturu Cattle Research Network</h1>
          <p className="animate-on-scroll fade-up delay-200">
            Preserving indigenous cattle breeds and advancing sustainable livestock genetics across West Africa
          </p>
          <Link to="/register" className="hero-btn animate-on-scroll fade-up delay-400">
            Join Our Network
          </Link>
        </div>
      </section>

      {/* ── About Preview ──────────────────────────────── */}
      <section className="section about-preview">
        <div className="container">
          <h2 className="section-title animate-on-scroll fade-up">Who We Are</h2>
          <div className="about-grid">
            {/* Image with skeleton */}
            <div className="about-image animate-on-scroll fade-left">
              <div className="img-wrapper" style={{ borderRadius: "12px", height: "400px" }}>
                <img src="/muturucattle.jpg" alt="Muturu Cattle" />
                <div className="skeleton-img" aria-hidden="true" />
              </div>
            </div>

            <div className="about-text animate-on-scroll fade-right">
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

      {/* ── Research Focus ─────────────────────────────── */}
      <section className="section research-focus">
        <div className="container">
          <h2 className="section-title animate-on-scroll fade-up">Our Research Focus</h2>
          <div className="research-grid">

            <div className="research-card animate-on-scroll fade-up delay-100">
              <div className="research-image">
                <div className="img-wrapper" style={{ height: "200px" }}>
                  <img src="/genetic-research.jpg" alt="Genetic Research" />
                  <div className="skeleton-img" aria-hidden="true" />
                </div>
              </div>
              <h3>Genetic Conservation</h3>
              <p>Preserving the unique genetic traits of Muturu cattle for future generations</p>
            </div>

            <div className="research-card animate-on-scroll fade-up delay-300">
              <div className="research-image">
                <div className="img-wrapper" style={{ height: "200px" }}>
                  <img src="/breeding.jpg" alt="Breeding Programs" />
                  <div className="skeleton-img" aria-hidden="true" />
                </div>
              </div>
              <h3>Breeding Programs</h3>
              <p>Developing sustainable breeding strategies to improve herd quality and productivity</p>
            </div>

            <div className="research-card animate-on-scroll fade-up delay-500">
              <div className="research-image">
                <div className="img-wrapper" style={{ height: "200px" }}>
                  <img src="/health.jpg" alt="Animal Health" />
                  <div className="skeleton-img" aria-hidden="true" />
                </div>
              </div>
              <h3>Disease Resistance</h3>
              <p>Studying the natural disease resistance of Muturu cattle in tropical environments</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Impact ─────────────────────────────────────── */}
      <section className="section home-impact-section">
        <div className="container">
          <h2 className="section-title animate-on-scroll fade-up">Our Impact</h2>
          <div className="home-impact-grid">

            <div className="home-impact-card animate-on-scroll zoom-in delay-100">
              <div className="home-impact-number" data-suffix="">74</div>
              <div className="home-impact-label">Research Scientists</div>
            </div>

            <div className="home-impact-card animate-on-scroll zoom-in delay-300">
              <div className="home-impact-number" data-suffix="">3</div>
              <div className="home-impact-label">Countries</div>
            </div>

            <div className="home-impact-card animate-on-scroll zoom-in delay-500">
              <div className="home-impact-number" data-suffix="">50</div>
              <div className="home-impact-label">Research Projects</div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Newsroom ───────────────────────────────────── */}
      <div className="animate-on-scroll fade-up">
        <NewsroomSection />
      </div>

      {/* ── Mission & Vision ───────────────────────────── */}
      <section className="section mission-section">
        <div className="container">
          <h2 className="section-title animate-on-scroll fade-up">Our Core Values</h2>
          <div className="mission-grid">
            <div className="mission-card animate-on-scroll fade-up delay-100">
              <h3>Vision</h3>
              <p>
                To be the leading research network for indigenous cattle conservation and sustainable livestock
                development in West Africa, ensuring food security and economic prosperity for rural communities.
              </p>
            </div>
            <div className="mission-card animate-on-scroll fade-up delay-300">
              <h3>Mission</h3>
              <p>
                To conduct cutting-edge research on Muturu cattle genetics, promote sustainable breeding practices, and
                empower farmers with knowledge and resources to preserve this valuable indigenous breed for future
                generations.
              </p>
            </div>
            <div className="mission-card animate-on-scroll fade-up delay-500">
              <h3>Objectives</h3>
              <p>
                Advance scientific understanding of Muturu cattle genetics • Build capacity among researchers and
                farmers • Promote sustainable livestock practices • Preserve indigenous genetic resources
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partners ───────────────────────────────────── */}
      <section className="section partnership-section">
        <div className="container">
          <h2 className="section-title animate-on-scroll fade-up">Our Partners</h2>
          <p className="section-subtitle animate-on-scroll fade-up delay-200">
            Collaborating with leading institutions across West Africa
          </p>
          <div className="animate-on-scroll fade-up delay-300">
            <PartnerSlider />
          </div>
        </div>
      </section>

      <div className="animate-on-scroll fade-up">
        <MuturuSectionSection />
      </div>

      <div className="animate-on-scroll fade-up">
        <PartnerWithUs />
      </div>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="home_h2 animate-on-scroll fade-up">Join Our Research Network</div>
            <div className="home_p animate-on-scroll fade-up delay-200">
              Be part of the largest species-based research network in Sub-Saharan Africa. Collaborate with leading
              scientists and contribute to preserving indigenous cattle breeds.
            </div>
            <div className="cta-buttons animate-on-scroll fade-up delay-400">
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