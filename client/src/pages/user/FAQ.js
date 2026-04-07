"use client"

import { useState } from "react"
import "../../styles/faq.css"
import Navbar from "../../components/NavBar"

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    {
      question: "What is the Muturu Cattle Research Network?",
      answer:
        "The Muturu Cattle Research Network (MCRN) is a dedicated organization focused on the conservation, research, and promotion of Muturu cattle, an indigenous West African breed. We work with researchers, farmers, and communities to preserve this valuable genetic resource and improve livestock management practices.",
    },
    {
      question: "What makes Muturu cattle unique?",
      answer:
        "Muturu cattle are small-sized indigenous cattle known for their exceptional hardiness, disease resistance, and adaptation to humid forest zones. They have been naturally selected over centuries and possess unique genetic traits that make them valuable for conservation and sustainable livestock production in West Africa.",
    },
    {
      question: "How can I become a member of MCRN?",
      answer:
        "You can become a member by filling out the membership application form on our website. We offer different membership categories including individual, institutional, and student memberships. Members receive access to research publications, networking opportunities, and invitations to our events and conferences.",
    },
    {
      question: "What research activities does MCRN conduct?",
      answer:
        "MCRN conducts various research activities including genetic characterization, performance evaluation, breeding programs, disease resistance studies, and documentation of traditional management practices. We also collaborate with universities and research institutions to advance knowledge about Muturu cattle.",
    },
    {
      question: "How can I support Muturu cattle conservation?",
      answer:
        "You can support conservation efforts by becoming a member, making donations, participating in our programs, spreading awareness about Muturu cattle, or collaborating with us on research projects. Every contribution helps preserve this important genetic resource for future generations.",
    },
    {
      question: "Where are Muturu cattle found?",
      answer:
        "Muturu cattle are primarily found in Nigeria, particularly in states like Anambra, Oyo, Ondo, and other forest and derived savanna zones. They are also found in other West African countries including Cameroon, where they are known by various local names.",
    },
    {
      question: "What are the main threats to Muturu cattle?",
      answer:
        "The main threats include crossbreeding with exotic breeds, habitat loss due to urbanization and agricultural expansion, changing farming practices, lack of organized breeding programs, and limited awareness about their conservation value. Climate change also poses emerging challenges.",
    },
    {
      question: "How does MCRN work with local farmers?",
      answer:
        "We work closely with local farmers through training programs, technical support, provision of breeding stock, and documentation of traditional knowledge. We also facilitate market access and promote the economic benefits of maintaining pure Muturu cattle herds.",
    },
    {
      question: "What events does MCRN organize?",
      answer:
        "MCRN organizes annual conferences, workshops, training sessions, field days, and community outreach programs. These events bring together researchers, farmers, policymakers, and stakeholders to share knowledge and promote Muturu cattle conservation.",
    },
    {
      question: "How can I access MCRN research publications?",
      answer:
        "Research publications are available to members through our online portal. Some publications are also freely accessible on our website. You can also request specific publications by contacting our research department.",
    },
    {
      question: "Does MCRN provide training opportunities?",
      answer:
        "Yes, we offer various training programs including livestock management, breeding techniques, disease prevention, record keeping, and sustainable farming practices. We also provide internship opportunities for students and early-career researchers.",
    },
    {
      question: "How can I contact MCRN for collaboration?",
      answer:
        "You can contact us through our website's contact form, email us directly, or call our office. We welcome collaborations with research institutions, NGOs, government agencies, and other organizations interested in livestock conservation and development.",
    },
  ]

  return (
    <div className="faq-page">
                   <Navbar />

      <div className="faq-hero">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about Muturu cattle and our organization</p>
        </div>
      </div>

      <div className="faq-content">
        <div className="container">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openIndex === index ? "active" : ""}`}>
                <button className="faq-question" onClick={() => toggleFAQ(index)}>
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openIndex === index ? "−" : "+"}</span>
                </button>
                {openIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="faq-cta">
            <h2>Still have questions?</h2>
            <p>Can't find the answer you're looking for? Please contact our support team.</p>
            <a href="/contact" className="contact-btn">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
