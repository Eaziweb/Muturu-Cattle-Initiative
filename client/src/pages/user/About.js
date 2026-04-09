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
    name: "Prof. Timothy Rotimi Fayeye",
    position: "President/Founder",
    image: "/president.png",
    bio: "Professor of Animal Breeding and Genetics at the University of Ilorin with over three decades of teaching and research experience in livestock genetics.",
    education: "PhD in Animal Breeding and Genetics, University of Ilorin",
    specialization: "Animal Breeding, Genetic Conservation, Livestock Improvement",
    publications: "Author of Genetic Principles and Animal Breeding + numerous publications",
    email: "fayetiro@gmail.com",
  },
  {
    id: 2,
    name: "Dr. Timothy Oluwafemi Ajiboye",
    position: "Trustee",
    image: "/trustee2.png",
    bio: "Specialist in crop protection and genetic resource management, currently leading the Field Gene Bank at NACGRAB, Ibadan.",
    education: "PhD in Crop Protection, University of Ilorin",
    specialization: "Genetic Resources, Crop Protection, Biodiversity Conservation",
    publications: "Research contributions in agriculture and genetic resource management",
    email: "ajiboyefemi2002@yahoo.com",
  },
  {
    id: 3,
    name: "Mrs. Olanike Foluke Fayeye",
    position: "Trustee",
    image: "/trustee1.png",
    bio: "Experienced educator with over 30 years in teaching, passionate about academic development and community impact.",
    education: "M.Ed in Social Studies Education",
    specialization: "Education, Curriculum Development, Community Engagement",
    publications: "Educational contributions and teaching experience",
    email: "olanikefolule@gmail.com",
  },
];

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
          The Muturu Cattle Network Initiative (MCNI) formerly called Muturu Cattle Research
Network is the largest species-based research network in Sub-Saharan Africa,
comprising over 100 dedicated scientists and livestock conservation enthusiast across
research stations and academic institutions in Nigeria, Ghana, Cameroon and Benin
Republic.
            </p>
            <p>
 Founded in 2024 to preserve and improve the indigenous muturu cattle breed and other
indigenous livestock species, our network brings together leading researchers,
veterinarians, geneticists, and other specialists who are committed to sustainable
livestock development in Africa.
            </p>
            <p>
          The goal of MCNI is to work closely with local farming communities, research stations,
government agencies, and international partners to ensure the long-term survival and
productivity of valuable African livestock genetic resources while supporting rural
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
              <h2>Our Aims</h2>
              <p>
               i. to promote the monitoring of population structure of Muturu cattle and other neglected
livestock of African Origin   </p>
<p> ii. to promote the conservation, management, genetic improvement and production
sustainability of Muturu cattle and other neglected livestock of African Origin</p>
<p>iii. to promote advocacy on improved government funding for conservation and
genetic improvement of Muturu cattle and other neglected livestock of African Origin </p>
<p>iv. to stimulate relevant stakeholders at subnational, national and international levels to
evolve policies and programs that could salvage the fastly depleting genetic resource of
African Origin.</p>
            
            </div>
            {/* <div className="vm-card mission-card">
              <h2>Our Mission</h2>
              <p>
                To conduct cutting-edge research on Muturu cattle genetics, promote sustainable breeding practices,
                build capacity among researchers and farmers, and create collaborative partnerships that advance
                livestock science and improve livelihoods across West Africa.
              </p>
            </div> */}
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
        <h3>International Research Conference</h3>
        <p>Successfully organized a global webinar bringing together experts from Nigeria, USA, Germany, and Benin to discuss Muturu cattle development.</p>
      </div>

      <div className="achievement-card">
        <h3>Cross-Border Collaboration</h3>
        <p>Established a network of over 100 researchers and stakeholders across multiple West African countries.</p>
      </div>

      <div className="achievement-card">
        <h3>Knowledge Dissemination</h3>
        <p>Promoted awareness of indigenous cattle conservation through academic discussions, public engagement, and digital platforms.</p>
      </div>

      <div className="achievement-card">
        <h3>Stakeholder Engagement</h3>
        <p>Connected researchers, farmers, and institutions to foster sustainable livestock practices and policy advocacy.</p>
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