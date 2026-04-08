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
const Sk = ({ w = "100%", h = "16px", r = "4px", style = {} }) => (
  <span className="sk" style={{ width: w, height: h, borderRadius: r, display: "block", ...style }} />
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
    const t = setTimeout(() => setLoaded(true), 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="home">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
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
        <div className="hero-scroll-hint">
          <span />
        </div>
      </section>

      {/* ── ABOUT PREVIEW ────────────────────────────────────────────────── */}
      <section className="section about-section">
        <div className="container">
          <FadeIn className="about-grid">
            <div className="about-img-wrap">
              {!loaded ? (
                <Sk w="100%" h="480px" r="2px" />
              ) : (
                <img src="/muturucattle.jpg" alt="Muturu Cattle" className="about-img" />
              )}
              <div className="about-img-badge">Est. 2018</div>
            </div>
            <div className="about-copy">
              <span className="section-label">Who We Are</span>
              {!loaded ? (
                <>
                  <Sk w="75%" h="40px" r="3px" style={{ marginBottom: 16 }} />
                  <Sk h="15px" style={{ marginBottom: 10 }} />
                  <Sk w="90%" h="15px" style={{ marginBottom: 10 }} />
                  <Sk w="85%" h="15px" style={{ marginBottom: 10 }} />
                  <Sk h="15px" style={{ marginBottom: 10 }} />
                  <Sk w="70%" h="15px" style={{ marginBottom: 32 }} />
                  <Sk w="160px" h="48px" r="2px" />
                </>
              ) : (
                <>
                  <h2 className="about-heading">
                    The largest species-based research network in Sub-Saharan Africa
                  </h2>
                  <p className="about-body">
                    Our network comprises <strong>74 scientists</strong> across research stations and
                    academic institutions in Nigeria, Ghana, and Benin Republic, united by a singular
                    mission: preserve and improve the Muturu — one of West Africa's most resilient
                    indigenous cattle breeds.
                  </p>
                  <p className="about-body">
                    From genetic conservation to community empowerment, we bridge cutting-edge
                    science with on-the-ground farming practice.
                  </p>
                  <Link to="/about" className="btn-primary">Our Story</Link>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── IMPACT NUMBERS ───────────────────────────────────────────────── */}
      <section className="impact-band">
        <div className="container">
          <div className="impact-grid">
            {[
              { num: 74, suffix: "+", label: "Research Scientists", sub: "Across 3 nations" },
              { num: 3,  suffix: "",  label: "Countries",           sub: "Nigeria · Ghana · Benin" },
              { num: 50, suffix: "+", label: "Active Projects",     sub: "Ongoing research" },
              { num: 12, suffix: "+", label: "Years of Data",       sub: "Longitudinal records" },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100} className="impact-card">
                <div className="impact-number">
                  {!loaded ? <Sk w="80px" h="52px" r="3px" style={{ margin: "0 auto 12px" }} /> : <Counter target={item.num} suffix={item.suffix} />}
                </div>
                <div className="impact-label">{item.label}</div>
                <div className="impact-sub">{item.sub}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESEARCH FOCUS ───────────────────────────────────────────────── */}
      <section className="section research-section">
        <div className="container">
          <FadeIn>
            <span className="section-label">What We Study</span>
            <h2 className="section-heading">Our Research Focus</h2>
          </FadeIn>
          <div className="research-grid">
            {[
              {
                img: "/genetic-research.jpg",
                num: "01",
                title: "Genetic Conservation",
                body: "Preserving the unique genetic traits of Muturu cattle — their trypanotolerance, heat resistance, and adaptability — for future generations."
              },
              {
                img: "/breeding.jpg",
                num: "02",
                title: "Breeding Programs",
                body: "Developing sustainable breeding strategies that improve herd quality and productivity without compromising genetic integrity."
              },
              {
                img: "/health.jpg",
                num: "03",
                title: "Disease Resistance",
                body: "Studying the natural immunity of Muturu cattle to trypanosomiasis and other tropical diseases endemic to West Africa."
              },
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 120} className="research-card">
                <div className="research-img-wrap">
                  {!loaded
                    ? <Sk w="100%" h="240px" r="0" />
                    : <img src={card.img} alt={card.title} />
                  }
                  <div className="research-num">{card.num}</div>
                </div>
                <div className="research-body">
                  {!loaded ? (
                    <>
                      <Sk w="60%" h="20px" r="3px" style={{ marginBottom: 10 }} />
                      <Sk h="13px" style={{ marginBottom: 7 }} />
                      <Sk w="85%" h="13px" />
                    </>
                  ) : (
                    <>
                      <h3>{card.title}</h3>
                      <p>{card.body}</p>
                    </>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSROOM ──────────────────────────────────────────────────────── */}
      <NewsroomSection />

      {/* ── VISION / MISSION / OBJECTIVES ───────────────────────────────── */}
      <section className="section values-section">
        <div className="container">
          <FadeIn>
            <span className="section-label">What Drives Us</span>
            <h2 className="section-heading">Our Core Values</h2>
          </FadeIn>
          <div className="values-grid">
            {[
              {
                icon: (
                  <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="4" x2="16" y2="11" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="21" x2="16" y2="28" stroke="currentColor" strokeWidth="1.5"/><line x1="4" y1="16" x2="11" y2="16" stroke="currentColor" strokeWidth="1.5"/><line x1="21" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.5"/></svg>
                ),
                title: "Vision",
                body: "To be the leading research network for indigenous cattle conservation and sustainable livestock development in West Africa, ensuring food security and economic prosperity for rural communities."
              },
              {
                icon: (
                  <svg viewBox="0 0 32 32" fill="none"><path d="M6 16 L16 6 L26 16 L16 26 Z" stroke="currentColor" strokeWidth="1.5"/><path d="M16 10 L22 16 L16 22 L10 16 Z" stroke="currentColor" strokeWidth="1.5"/></svg>
                ),
                title: "Mission",
                body: "To conduct cutting-edge research on Muturu cattle genetics, promote sustainable breeding practices, and empower farmers with knowledge to preserve this invaluable indigenous breed."
              },
              {
                icon: (
                  <svg viewBox="0 0 32 32" fill="none"><path d="M8 28 L8 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 28 L16 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M24 28 L24 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="15" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="24" cy="4" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
                ),
                title: "Objectives",
                body: "Advance scientific understanding of Muturu cattle genetics · Build capacity among researchers and farmers · Promote sustainable livestock practices · Preserve indigenous genetic resources."
              },
            ].map((v, i) => (
              <FadeIn key={i} delay={i * 110} className="value-card">
                <div className="value-icon">{v.icon}</div>
                {!loaded ? (
                  <>
                    <Sk w="50%" h="22px" r="3px" style={{ marginBottom: 14 }} />
                    <Sk h="13px" style={{ marginBottom: 8 }} />
                    <Sk w="90%" h="13px" style={{ marginBottom: 8 }} />
                    <Sk w="80%" h="13px" />
                  </>
                ) : (
                  <>
                    <h3>{v.title}</h3>
                    <p>{v.body}</p>
                  </>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ─────────────────────────────────────────────────────── */}
      <section className="section partners-section">
        <div className="container">
          <FadeIn>
            <span className="section-label">Collaborations</span>
            <h2 className="section-heading">Our Partners</h2>
            <p className="section-sub">Collaborating with leading institutions across West Africa</p>
          </FadeIn>
          <PartnerSlider />
        </div>
      </section>

      <MuturuSectionSection />

      <PartnerWithUs />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-grain" />
        <div className="container">
          <FadeIn className="cta-inner">
            <span className="section-label light">Get Involved</span>
            <h2 className="cta-heading">
              Join the Network.<br />Advance the Science.
            </h2>
            <p className="cta-body">
              Be part of the largest species-based research network in Sub-Saharan Africa.
              Collaborate with leading scientists and contribute to preserving indigenous cattle breeds.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn-primary light">Become a Member</Link>
              <Link to="/donate" className="btn-ghost light">Support Our Work</Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

export default Home