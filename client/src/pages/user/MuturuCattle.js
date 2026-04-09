import "../../styles/muturu-cattle.css"
import Navbar from "../../components/NavBar"
import { FaDna, FaLandmark, FaFlask, FaBook } from "react-icons/fa"

const MuturuCattle = () => {
  return (
    <div className="muturu-cattle-page">
      <Navbar />

      {/* Hero Section */}
      <div className="muturu-hero">
        <div className="hero-content">
          <h1>Muturu Cattle</h1>
          <p>Preserving Nigeria's Indigenous Livestock Heritage</p>
        </div>
        <div className="hero-image">
          <img src="muturu.jpeg" alt="Muturu cattle grazing" className="hero-img" />
        </div>
      </div>

      {/* Introduction Section */}
      <section className="main-muturu-intro">
        <div className="container">
          <div className="intro-content">
            <h2>About Muturu Cattle</h2>
            <p>
         The global livestock industry is currently dominated by a few highly productive breeds
that are widely distributed across various regions. The resultant disappearance or
extensive alteration of local breeds through crossbreeding, absorption, or outright
replacement by exotic breeds poses significant risks to the significantly untapped
African livestock genetic resources. It also portrays a grave prospect for food security
and sustainable livelihood in developing countries, especially in Sub-Saharan Africa.
Muturu cattle is a unique indigenous taurine cattle breed of West Africa. It was once a
very prominent breed of cattle in Nigeria and other West African countries like Benin
and Ghana. These small-sized cattle are known for their hardiness, disease resistance,
short generation interval and adaptation to the humid forest zones of West Africa. They
represent an important genetic resource that has been shaped by centuries of natural
selection and traditional management practices. However, the population of Muturu
cattle has gravely declined in the last few score years. The population has become
threatened due to various factors including preference for other breeds like the White
Fulani, crossbreeding with other breeds, habitat loss, and changing agricultural
practices.
            </p>
            <p>
There is the need for special attention in the domain of advocacy for policy shift,
research and collaborations among relevant stakeholders in the livestock value chain
with a view to preserve and promote Muturu cattle and other indigenous livestock
genetic resources for a diversified and sustainable livestock development in Africa.
            </p>
          </div>
        </div>
      </section>

      {/* How it is Known Section */}
      <section className="muturu-names">
        <div className="container">
          <div className="section-header">
            <h2>How Muturu Cattle is Known</h2>
            <p>Different names across regions and languages</p>
          </div>
          <div className="names-content">
            <div className="names-image">
              <img
                src="/muturuname.png"
                alt="How Muturu cattle is known in different regions"
                className="section-img"
              />
            </div>
            <div className="names-text">
              <h3>Regional Names</h3>
              <ul>
                <li>
                  <strong>Anglophone West Africa:</strong> Muturu
                </li>
                <li>
                  <strong>French-speaking regions:</strong> Baoule or Lagune
                </li>
                <li>
                  <strong>Nigeria:</strong> Kirdi
                </li>
                <li>
                  <strong>Cameroon:</strong> Bakweri, Kapsiki, Doayo, and Bakosi
                </li>
              </ul>
              <p>
                These various names reflect the widespread distribution of this cattle breed across West Africa and the
                cultural significance it holds in different communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="muturu-comparison">
        <div className="container">
          <div className="section-header">
            <h2>The Call to Action</h2>
            <p>Comparative analysis of indigenous cattle breeds</p>
          </div>
          <div className="comparison-content">
            <div className="comparison-text">
              <h3>Breed Comparison</h3>
              <p>
                Understanding the performance characteristics of Muturu cattle in comparison with other indigenous
                breeds like N'dama and Keteku is crucial for making informed decisions about conservation and breeding
                programs.
              </p>
              <div className="key-points">
                <h4>Key Performance Indicators:</h4>
                <ul>
                  <li>Age at first calving</li>
                  <li>Calving interval</li>
                  <li>Birth weight</li>
                  <li>Weaning weight</li>
                  <li>Mortality rates</li>
                </ul>
              </div>
            </div>
            <div className="comparison-image">
              <img
                src="/muturu-cta.png"
                alt="Comparison table of cattle breeds"
                className="section-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Improvement Potential Section */}
      <section className="muturu-improvement">
        <div className="container">
          <div className="section-header">
            <h2>The Potentials for Improvement</h2>
            <p>Enhancing productivity through better management</p>
          </div>
          <div className="improvement-content">
            <div className="improvement-image">
              <img
                src="/muturu-improve.jpg"
                alt="Improvement potential data for Muturu cattle"
                className="section-img"
              />
            </div>
            <div className="improvement-text">
              <h3>Management Systems Impact</h3>
              <p>
                Research shows significant differences in productivity between traditional village management and
                improved management systems. The data demonstrates the potential for enhancing Muturu cattle performance
                through:
              </p>
              <ul>
                <li>Improved nutrition and feeding practices</li>
                <li>Better healthcare and disease prevention</li>
                <li>Enhanced breeding management</li>
                <li>Proper housing and shelter</li>
                <li>Regular monitoring and record keeping</li>
              </ul>
              <div className="stats-highlight">
                <h4>Key Improvements Observed:</h4>
                <ul>
                  <li>Reduced age at first service</li>
                  <li>Increased milk production</li>
                  <li>Better calving intervals</li>
                  <li>Higher weaning weights</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Population Distribution Section */}
      <section className="muturu-distribution">
        <div className="container">
          <div className="section-header">
            <h2>Population Distribution by State</h2>
            <p>Muturu cattle population across Nigerian states (Akinwunmi & Ikpi, 1985)</p>
          </div>
          <div className="distribution-content">
            <div className="distribution-text">
              <h3>Geographic Distribution</h3>
              <p>
                The distribution of Muturu cattle across Nigerian states shows the concentration of this breed in
                specific regions, with Anambra state having the highest population followed by Oyo and Ondo states.
              </p>
              <div className="distribution-insights">
                <h4>Key Observations:</h4>
                <ul>
                  <li>Highest concentration in forest and derived savanna zones</li>
                  <li>Adaptation to humid tropical conditions</li>
                  <li>Traditional management in smallholder systems</li>
                  <li>Cultural and economic importance in local communities</li>
                </ul>
              </div>
              <div className="conservation-note">
                <h4>Conservation Status:</h4>
                <p>
                  Current population data indicates the need for urgent conservation measures to prevent further decline
                  of this valuable genetic resource.
                </p>
              </div>
            </div>
            <div className="distribution-image">
              <img
                src="/muturu-improvement.png"
                alt="Bar chart showing Muturu cattle population by Nigerian states"
                className="section-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Efforts Section */}
      <section className="muturu-conservation">
        <div className="container">
          <div className="conservation-content">
            <h2>Conservation Efforts</h2>
            <div className="conservation-grid">
              <div className="muturu-conservation-item">
                <div className="conservation-icon">
                  <FaDna />
                </div>
                <h3>Genetic Conservation</h3>
                <p>
                  Preserving the unique genetic makeup of Muturu cattle through selective breeding programs and genetic
                  banking.
                </p>
              </div>
              <div className="muturu-conservation-item">
                <div className="conservation-icon">
                  <FaLandmark />
                </div>
                <h3>In-situ Conservation</h3>
                <p>
                  Supporting traditional farmers and communities in maintaining Muturu cattle in their natural
                  environment.
                </p>
              </div>
              <div className="muturu-conservation-item">
                <div className="conservation-icon">
                  <FaFlask />
                </div>
                <h3>Research & Development</h3>
                <p>Conducting research on breed characteristics, performance, and adaptation strategies.</p>
              </div>
              <div className="muturu-conservation-item">
                <div className="conservation-icon">
                  <FaBook />
                </div>
                <h3>Documentation</h3>
                <p>
                  Recording and documenting traditional knowledge and management practices associated with Muturu
                  cattle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="muturu-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Join Our Conservation Efforts</h2>
            <p>
              Help us preserve this valuable genetic resource for future generations. Your support can make a difference
              in conserving Nigeria's indigenous livestock heritage.
            </p>
            <div className="cta-buttons">
              <a href="/membership" className="cta-btn primary">
                Become a Member
              </a>
              <a href="/donate" className="cta-btn secondary">
                Support Conservation
              </a>
              <a href="/contact" className="cta-btn tertiary">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MuturuCattle