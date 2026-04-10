"use client"
import { useParams, useNavigate } from "react-router-dom"
import "../../styles/ExecutiveDetail.css"
import Navbar from "../../components/NavBar"
import { FaEnvelope, FaPhone, FaGraduationCap, FaFlask, FaBook, FaTrophy, FaMicroscope, FaUserTie } from "react-icons/fa"

const ExecutiveDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Updated executive data
  const executives = {
    1: {
      id: 1,
      name: "Prof. Timothy Rotimi Fayeye",
      position: "President/Founder",
      image: "/president.png",
      bio: "Professor of Animal Breeding and Genetics at the University of Ilorin with over three decades of teaching and research experience in livestock genetics. He has dedicated his career to the conservation and improvement of indigenous livestock breeds, particularly the Muturu cattle. His pioneering work has established comprehensive breeding programs that have significantly impacted rural livestock farmers across Nigeria.",
      fullBio: "Prof. Timothy Rotimi Fayeye is a distinguished academic and researcher with over 30 years of experience in animal breeding and genetics. As the President and Founder of the Muturu Cattle Research Network, he has led numerous initiatives focused on the genetic conservation and sustainable management of indigenous cattle breeds. His visionary leadership has established partnerships with international research institutions and secured funding for groundbreaking research projects. Prof. Fayeye has supervised over 50 graduate students and continues to advocate for policies that support indigenous livestock development in West Africa.",
      education: "PhD in Animal Breeding and Genetics, University of Ilorin",
      specialization: "Animal Breeding, Genetic Conservation, Livestock Improvement, Population Genetics",
      publications: "Author of 'Genetic Principles and Animal Breeding' + over 80 peer-reviewed publications in international journals",
      email: "fayetiro@gmail.com",
      // phone: "+234 (0) 803 456 7890",
      achievements: [
        "Established the Muturu Cattle Research Network (MCRN) as a leading research institution",
        "Authored the first comprehensive textbook on Genetic Principles and Animal Breeding in Nigeria",
        "Secured over $3 million in research grants for indigenous cattle conservation",
        "Trained over 500 farmers in modern breeding techniques",
        "Recipient of the Nigerian Academy of Science Award for Outstanding Research (2022)",
        "Developed genetic improvement programs adopted by 10+ states across Nigeria",
      ],
      researchInterests: [
        "Genetic diversity assessment in indigenous cattle",
        "Sustainable breeding programs for tropical environments",
        "Conservation genetics of endangered livestock breeds",
        "Livestock productivity improvement through selective breeding",
        "Molecular characterization of local cattle populations",
        "Farmer participatory breeding approaches",
      ],
      awards: [
        "Nigerian Academy of Science Award for Outstanding Research (2022)",
        "University of Ilorin Vice-Chancellor's Research Excellence Award (2020)",
        "African Union Commission's Livestock Research Fellowship (2018)",
        "Best Researcher Award, Faculty of Agriculture, UNILORIN (2016)",
      ],
    },
    2: {
      id: 2,
      name: "Dr. Timothy Oluwafemi Ajiboye",
      position: "Trustee",
      image: "/trustee2.PNG",
      bio: "Specialist in crop protection and genetic resource management, currently leading the Field Gene Bank at the National Centre for Genetic Resources and Biotechnology (NACGRAB), Ibadan. His expertise bridges the gap between crop and animal genetic resource conservation.",
      fullBio: "Dr. Timothy Oluwafemi Ajiboye is a renowned specialist in crop protection and genetic resource management with over 15 years of experience at NACGRAB, Ibadan. As the Head of the Field Gene Bank, he manages one of West Africa's most important collections of plant genetic resources. His interdisciplinary approach has fostered collaboration between crop and livestock genetic conservation programs, creating integrated strategies for agricultural biodiversity preservation. Dr. Ajiboye has published extensively on genetic resource management and has trained numerous scientists across the region.",
      education: "PhD in Crop Protection, University of Ilorin",
      specialization: "Genetic Resources, Crop Protection, Biodiversity Conservation, Germplasm Management",
      publications: "45+ research contributions in agriculture and genetic resource management, including book chapters and peer-reviewed articles",
      email: "ajiboyefemi2002@yahoo.com",
      // phone: "+234 (0) 802 345 6789",
      achievements: [
        "Led the expansion of NACGRAB's Field Gene Bank to include over 2,000 accessions",
        "Developed innovative conservation protocols for endangered crop species",
        "Established the first integrated database for genetic resources in Nigeria",
        "Trained over 200 agricultural scientists in germplasm management techniques",
        "Recipient of the National Biotechnology Development Agency Excellence Award (2021)",
        "Pioneered community-based conservation programs for indigenous crops",
      ],
      researchInterests: [
        "In-situ and ex-situ conservation strategies",
        "Genetic erosion assessment in agricultural systems",
        "Climate-resilient crop varieties",
        "Indigenous knowledge systems in genetic conservation",
        "Molecular characterization of plant genetic resources",
        "Sustainable agricultural biodiversity management",
      ],
      awards: [
        "National Biotechnology Development Agency Excellence Award (2021)",
        "NACGRAB Outstanding Service Award (2019)",
        "Federal Ministry of Agriculture Research Fellowship (2017)",
        "Best Research Scientist, NACGRAB (2015)",
      ],
    },
    3: {
      id: 3,
      name: "Mrs. Olanike Foluke Fayeye",
      position: "Trustee",
      image: "/trustee1.PNG",
      bio: "Experienced educator with over 30 years in teaching, passionate about academic development and community impact. She brings invaluable expertise in educational program development and community outreach initiatives.",
      fullBio: "Mrs. Olanike Foluke Fayeye is a distinguished educator with over three decades of experience in the Nigerian educational system. Her career has been marked by a deep commitment to academic excellence and community development. As a trustee of MCRN, she has been instrumental in developing educational outreach programs that translate complex scientific concepts into accessible knowledge for rural farming communities. Mrs. Fayeye has designed and implemented numerous adult education programs that have empowered thousands of farmers with essential skills in livestock management and record-keeping.",
      education: "M.Ed in Social Studies Education",
      specialization: "Education, Curriculum Development, Community Engagement, Adult Education",
      publications: "Educational contributions including curriculum frameworks and teacher training manuals",
      email: "olanikefolule@gmail.com",
      // phone: "+234 (0) 805 678 9012",
      achievements: [
        "Developed award-winning community education programs reaching 10,000+ rural farmers",
        "Created innovative curriculum materials for adult agricultural education",
        "Trained over 500 teachers in effective community engagement strategies",
        "Established 15 community learning centers across Kwara State",
        "Received the Kwara State Ministry of Education Excellence Award (2020)",
        "Pioneered gender-inclusive educational programs in rural communities",
      ],
      researchInterests: [
        "Community-based education models",
        "Adult learning methodologies in agricultural settings",
        "Gender equity in rural education",
        "Indigenous knowledge documentation and integration",
        "Educational technology for rural communities",
        "Participatory learning approaches for farmers",
      ],
      awards: [
        "Kwara State Ministry of Education Excellence Award (2020)",
        "Nigerian Union of Teachers Distinguished Service Award (2018)",
        "Rotary International Community Development Award (2016)",
        "Best Teacher Award, Kwara State (2014)",
      ],
    },
  }

  const executive = executives[id]

  if (!executive) {
    return (
      <div className="executive-detail">
        <Navbar />
        <div className="container">
          <div className="error-container">
            <h2>Executive not found</h2>
            <button className="back-btn-large" onClick={() => navigate("/about")}>
              ← Back to About
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="executive-detail">
      <Navbar />

      <div className="executive-detail-container">
        <button className="back-btn" onClick={() => navigate("/about")}>
          ← Back to About
        </button>

        <div className="exec-header">
          <div className="exec-image-large">
            <img src={executive.image || "/placeholder.svg"} alt={executive.name} />
          </div>
          <div className="exec-header-info">
            <div className="exec-badge">
              <FaUserTie />
              <span>{executive.position}</span>
            </div>
            <h1>{executive.name}</h1>
            <div className="contact-info">
              <p>
                <FaEnvelope className="contact-icon" />
                <strong>Email:</strong> {executive.email}
              </p>
              {/* <p>
                <FaPhone className="contact-icon" />
                <strong>Phone:</strong> {executive.phone}
              </p> */}
            </div>
          </div>
        </div>

        <div className="exec-content">
          <div className="exec-main-section">
            <section className="exec-section">
              <h3>
                <FaUserTie className="section-icon" />
                Biography
              </h3>
              <p>{executive.bio}</p>
              <p className="full-bio">{executive.fullBio}</p>
            </section>

            <section className="exec-section">
              <h3>
                <FaGraduationCap className="section-icon" />
                Education
              </h3>
              <div className="education-card">
                <p>{executive.education}</p>
              </div>
            </section>

            <section className="exec-section">
              <h3>
                <FaFlask className="section-icon" />
                Specialization
              </h3>
              <div className="specialization-tags">
                {executive.specialization.split(", ").map((spec, index) => (
                  <span key={index} className="specialization-tag">
                    {spec}
                  </span>
                ))}
              </div>
            </section>

            <section className="exec-section">
              <h3>
                <FaBook className="section-icon" />
                Publications
              </h3>
              <div className="publications-card">
                <p>{executive.publications}</p>
              </div>
            </section>
          </div>

          <div className="exec-side-section">
            <section className="exec-section">
              <h3>
                <FaTrophy className="section-icon" />
                Key Achievements
              </h3>
              <ul className="achievements-list">
                {executive.achievements.map((achievement, index) => (
                  <li key={index}>
                    <span className="achievement-marker">🏆</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </section>

            <section className="exec-section">
              <h3>
                <FaMicroscope className="section-icon" />
                Research Interests
              </h3>
              <ul className="research-list">
                {executive.researchInterests.map((interest, index) => (
                  <li key={index}>
                    <span className="interest-marker">🔬</span>
                    {interest}
                  </li>
                ))}
              </ul>
            </section>

            {executive.awards && (
              <section className="exec-section">
                <h3>
                  <FaTrophy className="section-icon" />
                  Awards & Recognition
                </h3>
                <ul className="awards-list">
                  {executive.awards.map((award, index) => (
                    <li key={index}>
                      <span className="award-marker">⭐</span>
                      {award}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExecutiveDetail