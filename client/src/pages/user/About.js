"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PartnerWithUs from "../../components/PartnerWithUs"
import "../../styles/About.css"
import Navbar from "../../components/NavBar"
import { FaFlask, FaHandshake, FaLeaf, FaLightbulb, FaGraduationCap, FaGlobeAfrica, FaChevronLeft, FaChevronRight } from "react-icons/fa"

const About = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Executive team data
  const executives = [
    {
      id: 1,
      name: "Prof Fayeye Timothy Rotimi",
      position: "President/Founder",
      image: "/president.png",
      bio: "Leading expert in cattle genetics with over 25 years of research experience",
      education: "PhD in Animal Genetics, University of Ibadan",
      specialization: "Genetic Conservation, Breeding Programs",
      publications: "50+ peer-reviewed publications",
      email: "fayetiro@gmail.com",
    },
    {
      id: 2,
      name: "Prof. Adebayo",
      position: "Head of Research",
      image: "/placeholder-exec2.jpg",
      bio: "Renowned researcher in indigenous livestock breeds and sustainable agriculture",
      education: "PhD in Animal Science, Ahmadu Bello University",
      specialization: "Disease Resistance, Tropical Livestock",
      publications: "40+ peer-reviewed publications",
      email: "n.ekechi@mcrn.org",
    },
    {
      id: 3,
      name: "Dr. John",
      position: "Regional Coordinator (Ghana)",
      image: "/placeholder-exec3.jpg",
      bio: "Expert in community-based livestock management and farmer education",
      education: "PhD in Agricultural Extension, University of Ghana",
      specialization: "Farmer Training, Community Development",
      publications: "30+ peer-reviewed publications",
      email: "k.mensah@mcrn.org",
    },
    {
      id: 4,
      name: "Mr Ezekiel Adeoluwa",
      position: "Head of Human Relations",
      image: "/exec3.jpg",
      bio: "Specialist in molecular genetics and genomic analysis of cattle breeds",
      education: "PhD in Molecular Biology, University of Lagos",
      specialization: "Genomics, Molecular Markers",
      publications: "35+ peer-reviewed publications",
      email: "f.bello@mcrn.org",
    },
  ]

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % executives.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [executives.length])

  const handleExecutiveClick = (id) => {
    navigate(`/executive/${id}`)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? executives.length - 1 : prev - 1))
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % executives.length)
  }

  return (
    <div className="about-page">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>About Muturu Cattle Research Network</h1>
          <p>Preserving indigenous cattle breeds through research and collaboration</p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section who-we-are">
        <div className="container">
          <h2 className="section-title">Who We Are as an Organization</h2>
          <div className="who-content">
            <p>
              The Muturu Cattle Research Network (MCRN) is the largest species-based research network in Sub-Saharan
              Africa, comprising 74 dedicated scientists across research stations and academic institutions in Nigeria,
              Ghana, and Benin Republic.
            </p>
            <p>
              Founded to preserve and improve the indigenous Muturu cattle breed, our network brings together leading
              researchers, veterinarians, geneticists, and agricultural specialists committed to sustainable livestock
              development in West Africa.
            </p>
            <p>
              We work closely with local farming communities, government agencies, and international partners to ensure
              the long-term survival and productivity of this valuable genetic resource while supporting rural
              livelihoods and food security.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section core-values">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <FaFlask />
              </div>
              <h3>Scientific Excellence</h3>
              <p>Commitment to rigorous research and evidence-based practices</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FaHandshake />
              </div>
              <h3>Collaboration</h3>
              <p>Building partnerships across borders and disciplines</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FaLeaf />
              </div>
              <h3>Sustainability</h3>
              <p>Promoting environmentally responsible livestock practices</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FaLightbulb />
              </div>
              <h3>Innovation</h3>
              <p>Embracing new technologies and methodologies</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FaGraduationCap />
              </div>
              <h3>Education</h3>
              <p>Empowering farmers and researchers with knowledge</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FaGlobeAfrica />
              </div>
              <h3>Community Impact</h3>
              <p>Creating positive change in rural communities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section vision-mission">
        <div className="container">
          <div className="vm-grid">
            <div className="vm-card vision-card">
              <h2>Our Vision</h2>
              <p>
                To be the leading research network for indigenous cattle conservation and sustainable livestock
                development in West Africa, ensuring food security, economic prosperity, and environmental
                sustainability for rural communities while preserving valuable genetic resources for future generations.
              </p>
            </div>
            <div className="vm-card mission-card">
              <h2>Our Mission</h2>
              <p>
                To conduct cutting-edge research on Muturu cattle genetics, promote sustainable breeding practices,
                build capacity among researchers and farmers, and create collaborative partnerships that advance
                livestock science and improve livelihoods across West Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Team Slider */}
      <section className="section executive-section">
        <div className="container">
          <h2 className="section-title">Meet Our Executive Team</h2>
          <div className="slider-container">
            <div className="slider-wrapper">
              <div 
                className="slides-track" 
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {executives.map((exec) => (
                  <div
                    key={exec.id}
                    className="slide"
                    onClick={() => handleExecutiveClick(exec.id)}
                  >
                    <div className="exec-image">
                      <img src={exec.image || "/placeholder.svg"} alt={exec.name} />
                    </div>
                    <div className="exec-info">
                      <h3>{exec.name}</h3>
                      <p className="exec-position">{exec.position}</p>
                      <p className="exec-bio">{exec.bio}</p>
                      <button className="view-profile-btn">View Full Profile</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="slider-nav">
              <button className="slider-btn prev" onClick={goToPrevSlide}>
                <FaChevronLeft />
              </button>
              <button className="slider-btn next" onClick={goToNextSlide}>
                <FaChevronRight />
              </button>
            </div>
            
            <div className="slider-dots">
              {executives.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section achievements">
        <div className="container">
          <h2 className="section-title">Our Achievements</h2>
          <div className="achievements-grid">
            <div className="achievement-card">
              <h3>Research Publications</h3>
              <p>Over 200 peer-reviewed publications in international journals</p>
            </div>
            <div className="achievement-card">
              <h3>Genetic Database</h3>
              <p>Comprehensive genetic database of Muturu cattle across West Africa</p>
            </div>
            <div className="achievement-card">
              <h3>Farmer Training</h3>
              <p>5,000+ farmers trained in sustainable breeding practices</p>
            </div>
            <div className="achievement-card">
              <h3>International Recognition</h3>
              <p>Partnerships with leading research institutions worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner With Us section */}
      <PartnerWithUs />
    </div>
  )
}

export default About