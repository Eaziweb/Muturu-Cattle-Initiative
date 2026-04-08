"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import NewsroomSection from "../../components/NewsroomSection"
import PartnerWithUs from "../../components/PartnerWithUs"
import PartnerSlider from "../../components/PartnerSlider"
import Navbar from "../../components/NavBar"
import MuturuSectionSection from "../../components/MuturuCattleSection"
import "../../styles/home.css"

/* ── Skeleton primitives ─────────────────────────────────────────────────── */
/* ── Skeleton primitive aligned with skeleton.css ─────────────────────────── */
const Sk = ({ w = "100%", h = "16px", r = "4px", style = {} }) => (
  <span 
    className="skeleton-shimmer" 
    style={{ 
      width: w, 
      height: h, 
      borderRadius: r, 
      display: "block", 
      ...style 
    }} 
  />
)

/* ── Animated counter ────────────────────────────────────────────────────── */
const Counter = ({ target, suffix = "+" }) => {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let start = 0
      const step = Math.ceil(target / 60)
      const id = setInterval(() => {
        start = Math.min(start + step, target)
        setVal(start)
        if (start >= target) clearInterval(id)
      }, 24)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ── Fade-in wrapper ──────────────────────────────────────────────────────── */
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [vis, setVis] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`fade-wrap ${vis ? "fade-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════ */

const Home = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Mimic data fetching
    const t = setTimeout(() => setLoaded(true), 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="home">
      <Navbar />

      {/* ── HERO (Always shows or uses transition anims) ────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grain" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-body">
          <div className={`hero-eyebrow ${loaded ? "hero-anim-1" : ""}`}>
            West Africa · Conservation Science · Indigenous Breeds
          </div>
          <h1 className={`hero-title ${loaded ? "hero-anim-2" : ""}`}>
            Muturu Cattle<br />
            <em>Research Network</em>
          </h1>
          <p className={`hero-sub ${loaded ? "hero-anim-3" : ""}`}>
            Preserving indigenous cattle breeds and advancing sustainable livestock genetics
            across Nigeria, Ghana, and Benin Republic.
          </p>
          <div className={`hero-actions ${loaded ? "hero-anim-4" : ""}`}>
            <Link to="/register" className="btn-primary">Join Our Network</Link>
            <Link to="/about" className="btn-ghost">Learn More</Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT PREVIEW (Split Grid Skeleton) ─────────────────────────── */}
      <section className="section about-section">
        <div className="container">
          <FadeIn className="about-grid">
            <div className="about-img-wrap">
              {!loaded ? (
                <Sk h="480px" r="12px" />
              ) : (
                <>
                  <img src="/muturucattle.jpg" alt="Muturu Cattle" className="about-img" />
                  <div className="about-img-badge">Est. 2018</div>
                </>
              )}
            </div>
            <div className="about-copy">
              <span className="section-label">Who We Are</span>
              {!loaded ? (
                <>
                  <Sk w="85%" h="42px" style={{ marginBottom: 20 }} />
                  <Sk h="14px" style={{ marginBottom: 12 }} />
                  <Sk w="95%" h="14px" style={{ marginBottom: 12 }} />
                  <Sk w="90%" h="14px" style={{ marginBottom: 12 }} />
                  <Sk w="40%" h="14px" style={{ marginBottom: 32 }} />
                  <Sk w="180px" h="50px" r="8px" />
                </>
              ) : (
                <>
                  <h2 className="about-heading">
                    The largest species-based research network in Sub-Saharan Africa
                  </h2>
                  <p className="about-body">
                    Our network comprises <strong>74 scientists</strong> across research stations and 
                    academic institutions, united by a singular mission: preserve and improve the Muturu.
                  </p>
                  <p className="about-body">
                    We bridge cutting-edge science with on-the-ground farming practice.
                  </p>
                  <Link to="/about" className="btn-primary">Our Story</Link>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── IMPACT NUMBERS (Centered Card Skeletons) ───────────────────── */}
      <section className="impact-band">
        <div className="container">
          <div className="impact-grid">
            {[
              { num: 74, suffix: "+", label: "Research Scientists", sub: "Across 3 nations" },
              { num: 3, suffix: "", label: "Countries", sub: "Nigeria · Ghana · Benin" },
              { num: 50, suffix: "+", label: "Active Projects", sub: "Ongoing research" },
              { num: 12, suffix: "+", label: "Years of Data", sub: "Longitudinal records" },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100} className="impact-card">
                {!loaded ? (
                  <>
                    <Sk w="70px" h="48px" style={{ margin: "0 auto 12px" }} />
                    <Sk w="60%" h="14px" style={{ margin: "0 auto 8px" }} />
                    <Sk w="40%" h="11px" style={{ margin: "0 auto" }} />
                  </>
                ) : (
                  <>
                    <div className="impact-number">
                      <Counter target={item.num} suffix={item.suffix} />
                    </div>
                    <div className="impact-label">{item.label}</div>
                    <div className="impact-sub">{item.sub}</div>
                  </>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESEARCH FOCUS (Card-style Skeletons) ─────────────────────── */}
      <section className="section research-section">
        <div className="container">
          <span className="section-label">What We Study</span>
          <h2 className="section-heading">Our Research Focus</h2>
          <div className="research-grid">
            {[1, 2, 3].map((_, i) => (
              <FadeIn key={i} delay={i * 120} className="research-card">
                {!loaded ? (
                  <>
                    <Sk h="240px" r="0" />
                    <div className="research-body">
                      <Sk w="70%" h="22px" style={{ marginBottom: 12 }} />
                      <Sk h="13px" style={{ marginBottom: 8 }} />
                      <Sk w="90%" h="13px" style={{ marginBottom: 8 }} />
                      <Sk w="50%" h="13px" />
                    </div>
                  </>
                ) : (
                  <CardContent i={i} /> /* Extract logic for cleaner code if needed */
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES SECTION (Icon + Text Skeletons) ────────────────────── */}
      <section className="section values-section">
        <div className="container">
          <span className="section-label">What Drives Us</span>
          <h2 className="section-heading">Our Core Values</h2>
          <div className="values-grid">
            {[1, 2, 3].map((_, i) => (
              <FadeIn key={i} delay={i * 110} className="value-card">
                <div className="value-icon">
                  {!loaded ? <Sk w="40px" h="40px" r="50%" /> : <IconComponent i={i} />}
                </div>
                {!loaded ? (
                  <>
                    <Sk w="40%" h="20px" style={{ marginBottom: 14 }} />
                    <Sk h="13px" style={{ marginBottom: 8 }} />
                    <Sk w="90%" h="13px" style={{ marginBottom: 8 }} />
                    <Sk w="70%" h="13px" />
                  </>
                ) : (
                  <ValueContent i={i} />
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Remaining sections like Newsroom, Partners, and CTA can follow same pattern */}
      <NewsroomSection loaded={loaded} />
      <PartnerSlider loaded={loaded} />
      <MuturuSectionSection />
      <PartnerWithUs />
    </div>
  )
}

export default Home