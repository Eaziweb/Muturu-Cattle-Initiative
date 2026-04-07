import "../../styles/LegalPages.css"
import Navbar from "../../components/NavBar"

const LegalPages = ({ page }) => {
  const renderContent = () => {
    switch (page) {
      case "privacy":
        return (
          <>
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last Updated: January 2025</p>

            <section>
              <h2>1. Introduction</h2>
              <p>
                Muturu Cattle Research Network ("we," "our," or "us") is committed to protecting your privacy. This
                Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our
                website or use our services.
              </p>
            </section>

            <section>
              <h2>2. Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us, including:</p>
              <ul>
                <li>Name and contact information (email, phone number, address)</li>
                <li>Professional credentials and affiliations</li>
                <li>Research interests and expertise</li>
                <li>Academic and professional background</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>When you visit our website, we may automatically collect:</p>
              <ul>
                <li>IP address and browser type</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Device information</li>
              </ul>
            </section>

            <section>
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Facilitate network membership and collaboration</li>
                <li>Communicate research updates and opportunities</li>
                <li>Improve our website and services</li>
                <li>Respond to inquiries and provide support</li>
                <li>Conduct research and analysis</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2>4. Information Sharing and Disclosure</h2>
              <p>We may share your information with:</p>
              <ul>
                <li>Other network members for collaboration purposes</li>
                <li>Partner institutions and research organizations</li>
                <li>Service providers who assist in our operations</li>
                <li>Legal authorities when required by law</li>
              </ul>
              <p>We do not sell your personal information to third parties.</p>
            </section>

            <section>
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
                over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </section>

            <section>
              <h2>7. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
                <br />
                Email: privacy@mcrn.org
                <br />
                Phone: +234 (0) 123 456 7890
              </p>
            </section>
          </>
        )

      case "terms":
        return (
          <>
            <h1>Terms of Service</h1>
            <p className="last-updated">Last Updated: January 2025</p>

            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Muturu Cattle Research Network website and services, you accept and agree to
                be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2>2. Membership and Registration</h2>
              <h3>Eligibility</h3>
              <p>
                Membership is open to researchers, academics, students, and professionals involved in livestock research
                and related fields. You must provide accurate and complete information during registration.
              </p>

              <h3>Account Responsibilities</h3>
              <ul>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Be responsible for all activities under your account</li>
                <li>Provide accurate and up-to-date information</li>
              </ul>
            </section>

            <section>
              <h2>3. Intellectual Property</h2>
              <h3>Network Content</h3>
              <p>
                All content on this website, including text, graphics, logos, and research materials, is the property of
                MCRN or its content suppliers and is protected by copyright laws.
              </p>

              <h3>User-Generated Content</h3>
              <p>
                By submitting content to our platform, you grant MCRN a non-exclusive, worldwide, royalty-free license
                to use, reproduce, and distribute your content for research and educational purposes.
              </p>
            </section>

            <section>
              <h2>4. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful or malicious code</li>
                <li>Harass or harm other users</li>
                <li>Use the service for unauthorized commercial purposes</li>
                <li>Misrepresent your identity or affiliation</li>
              </ul>
            </section>

            <section>
              <h2>5. Research Ethics</h2>
              <p>
                All members must adhere to ethical research practices, including proper citation of sources, respect for
                animal welfare, and compliance with institutional review board requirements.
              </p>
            </section>

            <section>
              <h2>6. Limitation of Liability</h2>
              <p>
                MCRN is not liable for any indirect, incidental, special, or consequential damages arising from your use
                of our services. We provide the service "as is" without warranties of any kind.
              </p>
            </section>

            <section>
              <h2>7. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at any time for violation of these terms or
                for any other reason at our discretion.
              </p>
            </section>

            <section>
              <h2>8. Changes to Terms</h2>
              <p>
                We may modify these terms at any time. Continued use of our services after changes constitutes
                acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2>9. Contact Information</h2>
              <p>
                For questions about these Terms of Service, contact us at:
                <br />
                Email: legal@mcrn.org
                <br />
                Phone: +234 (0) 123 456 7890
              </p>
            </section>
          </>
        )

      case "faq":
        return (
          <>
            <h1>Frequently Asked Questions</h1>

            <section>
              <h2>General Questions</h2>

              <div className="faq-item">
                <h3>What is the Muturu Cattle Research Network?</h3>
                <p>
                  The Muturu Cattle Research Network (MCRN) is the largest species-based research network in Sub-Saharan
                  Africa, comprising 74 scientists across Nigeria, Ghana, and Benin Republic. We focus on preserving and
                  improving the indigenous Muturu cattle breed through research and collaboration.
                </p>
              </div>

              <div className="faq-item">
                <h3>Who can join the network?</h3>
                <p>
                  Membership is open to researchers, academics, students, veterinarians, and professionals involved in
                  livestock research, animal genetics, veterinary science, and related fields. We welcome anyone
                  passionate about indigenous cattle conservation.
                </p>
              </div>

              <div className="faq-item">
                <h3>What are the benefits of membership?</h3>
                <p>
                  Members gain access to research publications, collaboration opportunities, training programs,
                  networking events, funding opportunities, and a community of experts in cattle genetics and livestock
                  management.
                </p>
              </div>
            </section>

            <section>
              <h2>Research and Collaboration</h2>

              <div className="faq-item">
                <h3>How can I collaborate with MCRN researchers?</h3>
                <p>
                  Contact us through our website or reach out directly to specific researchers. We encourage
                  collaborative projects and can help facilitate partnerships between institutions and individual
                  researchers.
                </p>
              </div>

              <div className="faq-item">
                <h3>Do you offer research funding?</h3>
                <p>
                  We provide information about funding opportunities and occasionally offer small grants for specific
                  research projects. Check our announcements section regularly for funding calls.
                </p>
              </div>

              <div className="faq-item">
                <h3>Can I access your research publications?</h3>
                <p>
                  Many of our publications are available through our research blog. Members have access to additional
                  resources and detailed research papers. Some publications may require institutional access through
                  academic databases.
                </p>
              </div>
            </section>

            <section>
              <h2>Training and Education</h2>

              <div className="faq-item">
                <h3>Do you offer training programs?</h3>
                <p>
                  Yes, we regularly conduct training workshops for farmers, students, and researchers on topics
                  including breeding practices, disease management, and genetic conservation. Check our events section
                  for upcoming programs.
                </p>
              </div>

              <div className="faq-item">
                <h3>Can students participate in research projects?</h3>
                <p>
                  We welcome graduate and undergraduate students interested in livestock research. Contact our research
                  coordinators to discuss available opportunities and mentorship programs.
                </p>
              </div>
            </section>

            <section>
              <h2>Technical Questions</h2>

              <div className="faq-item">
                <h3>How do I update my profile information?</h3>
                <p>
                  Log in to your account and navigate to your profile settings. You can update your contact information,
                  research interests, and professional details at any time.
                </p>
              </div>

              <div className="faq-item">
                <h3>I forgot my password. What should I do?</h3>
                <p>
                  Click the "Forgot Password" link on the login page and follow the instructions to reset your password.
                  If you continue to experience issues, contact our support team.
                </p>
              </div>
            </section>

            <section>
              <h2>Contact and Support</h2>

              <div className="faq-item">
                <h3>How can I contact MCRN?</h3>
                <p>
                  You can reach us via email at info@mcrn.org, by phone at +234 (0) 123 456 7890, or through our contact
                  form. We typically respond within 24-48 hours during business days.
                </p>
              </div>

              <div className="faq-item">
                <h3>Where are you located?</h3>
                <p>
                  Our main office is located at the Muturu Cattle Research Institute, 123 Research Drive, Abuja,
                  Nigeria. We also have regional coordinators in Ghana and Benin Republic.
                </p>
              </div>
            </section>
          </>
        )

      default:
        return <h1>Page not found</h1>
    }
  }

  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-content">{renderContent()}</div>
      </div>
    </div>
  )
}

export default LegalPages
