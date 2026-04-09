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
          <h1 className="animate-on-scroll fade-up">Muturu Cattle Research Initiative</h1>
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
     <p> The Muturu Cattle Network Initiative (MCNI), formerly the Muturu Cattle Research Network, is the largest species-based research network in Sub-Saharan Africa. It comprises over 100 scientists and livestock conservation enthusiasts across research and academic institutions in Nigeria, Ghana, Cameroon, and Benin Republic. </p> <p> Founded in 2024, MCNI focuses on preserving and improving the indigenous Muturu cattle breed and other local livestock species by bringing together researchers, veterinarians, geneticists, and other experts committed to sustainable livestock development in Africa. </p> <p> MCNI works closely with farming communities, research institutions, government agencies, and international partners to ensure the long-term survival and productivity of African livestock genetic resources while supporting rural livelihoods and food security. </p>
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
  To protect and enhance Africa's native cattle breeds, ensuring resilient farming systems, improved productivity, and sustainable economic growth for rural communities while preserving valuable genetic resources for future generations.
              </p>
            </div>
            <div className="mission-card animate-on-scroll fade-up delay-300">
              <h3>Mission</h3>
              <p>
     The mission  of MCNI is to work closely with local farming communities, research stations, government agencies, and international partners to conserve and improve indigenous African livestock to build sustainable livelihoods for farmers and stakeholders.
              </p>
            </div>
            <div className="mission-card animate-on-scroll fade-up delay-500">
             <h3>Objectives</h3>
<p>
  • To examine the historical significance and current status of Muturu cattle in West Africa.<br />
  • To promote awareness on the importance of conserving indigenous livestock genetic resources.<br />
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
        <PartnerWithUs />
      </div>
      <div className="animate-on-scroll fade-up">
        <MuturuSectionSection />
      </div>

  
    </div>
  )
}

export default Home