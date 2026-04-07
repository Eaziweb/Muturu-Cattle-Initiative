"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import "../styles/newsroom.css"

const NewsroomSection = () => {
  const navigate = useNavigate()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRecentBlogs()
  }, [])

  const fetchRecentBlogs = async () => {
    try {
      setLoading(true)
      const response = await api.get("/blogs/recent?limit=3")
      setNews(response.data)
    } catch (error) {
      console.error("Error fetching recent blogs:", error)
      setError("Failed to load recent news")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.svg?key=news"

    if (typeof image === "object" && image.url) {
      return image.url
    }

    return image
  }

  const mapCategory = (tags) => {
    if (!tags || tags.length === 0) return "News"

    const categoryMap = {
      research: "Research",
      event: "Events",
      conference: "Events",
      partnership: "Partnership",
      collaboration: "Partnership",
      announcement: "Announcement",
    }

    for (const tag of tags) {
      const lowerTag = tag.toLowerCase()
      for (const [key, value] of Object.entries(categoryMap)) {
        if (lowerTag.includes(key)) {
          return value
        }
      }
    }

    return "News"
  }

  if (loading) {
    return (
      <section className="newsroom-section">
        <div className="newsroom-container">
          <div className="newsroom-header">
            <h2>From the Newsroom</h2>
            <p>Stay updated with the latest news, research findings, and developments from our network</p>
          </div>
          <div className="news-loading">
            <div className="loading-spinner"></div>
            <p>Loading latest news...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="newsroom-section">
        <div className="newsroom-container">
          <div className="newsroom-header">
            <h2>From the Newsroom</h2>
            <p>Stay updated with the latest news, research findings, and developments from our network</p>
          </div>
          <div className="news-error">
            <p>{error}</p>
            <button onClick={fetchRecentBlogs} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="newsroom-section">
      <div className="newsroom-container">
        <div className="newsroom-header">
          <h2>From the Newsroom</h2>
          <p>Stay updated with the latest news, research findings, and developments from our network</p>
        </div>

        <div className="news-grid">
          {news.map((article) => (
            <article key={article._id} className="news-card">
              <div className="news-image">
                <img
                  src={getImageUrl(article.image) || "/placeholder.svg"}
                  alt={article.title}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg?key=news-fallback"
                  }}
                />
                <div className="news-category">{mapCategory(article.tags)}</div>
              </div>
              <div className="news-content">
                <div className="news-meta">
                  <span className="news-date">{formatDate(article.createdAt)}</span>
                </div>
                <h3 className="news-title">{article.title}</h3>
                <p className="news-excerpt">{article.excerpt}</p>
                <button className="read-more-btn" onClick={() => navigate(`/blog/${article._id}`)}>
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="newsroom-footer">
          <button className="view-all-btn" onClick={() => navigate("/blogs")}>
            View All News
          </button>
        </div>
      </div>
    </section>
  )
}

export default NewsroomSection
