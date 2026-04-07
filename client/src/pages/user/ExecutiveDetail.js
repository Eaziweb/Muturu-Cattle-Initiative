"use client"
import { useParams, useNavigate } from "react-router-dom"
import "../../styles/ExecutiveDetail.css"
import Navbar from "../../components/NavBar"

const ExecutiveDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Executive data (same as in About.js)
  const executives = {
    1: {
      name: "Prof. Fayeye Timothy Rotimi",
      position: "Director General",
      image: "/president.png",
      bio: "Dr. Adebayo Ogunlesi is a leading expert in cattle genetics with over 25 years of research experience in indigenous livestock breeds. He has dedicated his career to preserving and improving the Muturu cattle breed across West Africa.",
      education: "PhD in Animal Genetics, University of Ibadan",
      specialization: "Genetic Conservation, Breeding Programs, Livestock Management",
      publications: "50+ peer-reviewed publications",
      email: "a.ogunlesi@mcrn.org",
      phone: "+234 (0) 123 456 7890",
      achievements: [
        "Established the first comprehensive genetic database for Muturu cattle",
        "Led international research collaborations with 15+ institutions",
        "Received the West African Livestock Research Excellence Award (2020)",
        "Trained over 100 graduate students in animal genetics",
      ],
      researchInterests: [
        "Genetic diversity and conservation",
        "Breeding strategies for tropical environments",
        "Disease resistance in indigenous cattle",
        "Sustainable livestock production systems",
      ],
    },
    2: {
      name: "Prof. Adebayo",
      position: "Head of Research",
      image: "/placeholder-exec2.jpg",
      bio: "Prof. Ngozi Ekechi is a renowned researcher in indigenous livestock breeds and sustainable agriculture with extensive experience in tropical livestock management and disease resistance studies.",
      education: "PhD in Animal Science, Ahmadu Bello University",
      specialization: "Disease Resistance, Tropical Livestock, Veterinary Science",
      publications: "40+ peer-reviewed publications",
      email: "n.ekechi@mcrn.org",
      phone: "+234 (0) 123 456 7891",
      achievements: [
        "Pioneered research on trypanosomiasis resistance in Muturu cattle",
        "Published groundbreaking studies on heat stress adaptation",
        "Secured $2M in research grants for livestock health projects",
        "Developed innovative vaccination protocols for tropical cattle",
      ],
      researchInterests: [
        "Disease resistance mechanisms",
        "Tropical livestock health",
        "Veterinary epidemiology",
        "Climate adaptation in cattle",
      ],
    },
    3: {
      name: "Mrs Olanike Foluke",
      position: "Regional Coordinator (Ghana)",
      image: "/placeholder-exec3.jpg",
      bio: "Dr. Kwame Mensah is an expert in community-based livestock management and farmer education, with a passion for empowering rural communities through sustainable agricultural practices.",
      education: "PhD in Agricultural Extension, University of Ghana",
      specialization: "Farmer Training, Community Development, Extension Services",
      publications: "30+ peer-reviewed publications",
      email: "k.mensah@mcrn.org",
      phone: "+233 (0) 123 456 7890",
      achievements: [
        "Trained over 3,000 farmers in sustainable breeding practices",
        "Established 25 community-based breeding centers",
        "Developed farmer-friendly extension materials in local languages",
        "Received the Community Impact Award from Ghana Agricultural Society",
      ],
      researchInterests: [
        "Participatory livestock development",
        "Farmer knowledge systems",
        "Community-based conservation",
        "Agricultural extension methodologies",
      ],
    },
    4: {
      name: "Mr Ezekiel Adeoluwa",
      position: "Head of Genetics Lab",
      image: "/exec3.jpg",
      bio: "Dr. Fatima Bello is a specialist in molecular genetics and genomic analysis of cattle breeds, leading cutting-edge research in genetic markers and genomic selection for improved livestock productivity.",
      education: "PhD in Molecular Biology, University of Lagos",
      specialization: "Genomics, Molecular Markers, Genetic Analysis",
      publications: "35+ peer-reviewed publications",
      email: "f.bello@mcrn.org",
      phone: "+234 (0) 123 456 7892",
      achievements: [
        "Identified key genetic markers for disease resistance in Muturu cattle",
        "Established state-of-the-art molecular genetics laboratory",
        "Published in top-tier journals including Nature Genetics",
        "Mentored 50+ students in molecular genetics techniques",
      ],
      researchInterests: [
        "Genomic selection",
        "Molecular markers for livestock improvement",
        "Population genetics",
        "Bioinformatics and computational biology",
      ],
    },
  }

  const executive = executives[id]

  if (!executive) {
    return (
      <div className="executive-detail">
        <div className="container">
          <h2>Executive not found</h2>
          <button onClick={() => navigate("/about")}>Back to About</button>
        </div>
      </div>
    )
  }

  return (
    <div className="executive-detail">
                   <Navbar />

      <div className="container">
        <button className="back-btn" onClick={() => navigate("/about")}>
          ← Back to About
        </button>

        <div className="exec-header">
          <div className="exec-image-large">
            <img src={executive.image || "/placeholder.svg"} alt={executive.name} />
          </div>
          <div className="exec-header-info">
            <h1>{executive.name}</h1>
            <h2>{executive.position}</h2>
            <div className="contact-info">
              <p>
                <strong>Email:</strong> {executive.email}
              </p>
              <p>
                <strong>Phone:</strong> {executive.phone}
              </p>
            </div>
          </div>
        </div>

        <div className="exec-content">
          <section className="exec-section">
            <h3>Biography</h3>
            <p>{executive.bio}</p>
          </section>

          <section className="exec-section">
            <h3>Education</h3>
            <p>{executive.education}</p>
          </section>

          <section className="exec-section">
            <h3>Specialization</h3>
            <p>{executive.specialization}</p>
          </section>

          <section className="exec-section">
            <h3>Publications</h3>
            <p>{executive.publications}</p>
          </section>

          <section className="exec-section">
            <h3>Key Achievements</h3>
            <ul className="achievements-list">
              {executive.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </section>

          <section className="exec-section">
            <h3>Research Interests</h3>
            <ul className="research-list">
              {executive.researchInterests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ExecutiveDetail
