"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../../utils/api"
import "../../styles/blog-reader.css"
import Navbar from "../../components/NavBar"

const BlogReader = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [recentBlogs, setRecentBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await api.get(`/blogs/${id}`)
      setBlog(response.data.blog)
      setRecentBlogs(response.data.recentBlogs)
    } catch (error) {
      console.error("Error fetching blog:", error)
      setError("Blog not found or failed to load")
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

  const shareOnSocial = (platform) => {
    const url = window.location.href
    const title = blog?.title || ""

    let shareUrl = ""
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      default:
        return
    }

    window.open(shareUrl, "_blank", "width=600,height=400")
  }

  const getImageUrl = (image) => {
    if (!image) return "/blog-post.jpg"

    if (typeof image === "object" && image.url) {
      return image.url
    }

    return image
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loadingSpinner"></div>
        <p>Loading article...</p>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="error-container">
        <h2>Article Not Found</h2>
        <p>{error || "The article you're looking for doesn't exist."}</p>
        <Link to="/blogs" className="btn btn-primary">
          Back to Articles
        </Link>
      </div>
    )
  }

  return (
    
    <div className="blog-reader">
             <Navbar />

      <div className="blog-reader-container">
        <article className="main-article">
          <header className="article-header">
            <div className="breadcrumb">
              <Link to="/blogs">Articles</Link>
              <span> / </span>
              <span>{blog.title}</span>
            </div>
            <h1 className="article-title">{blog.title}</h1>
            <div className="article-meta">
              <span className="article-author">By {blog.author}</span>
              <span className="article-date">{formatDate(blog.createdAt)}</span>
              <span className="article-views">{blog.views} views</span>
            </div>
            {blog.tags && blog.tags.length > 0 && (
              <div className="article-tags">
                {blog.tags.map((tag) => (
                  <span key={tag} className="article-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="article-image">
            <img src={getImageUrl(blog.image) || "/placeholder.svg"} alt={blog.title} className="main-img" />
          </div>

          <div className="article-content">
            {blog.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="article-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="article-footer">
            <div className="share-section">
              <h3>Share this article</h3>
              <div className="share-buttons">
                <button className="share-btn facebook" onClick={() => shareOnSocial("facebook")}>
                  Facebook
                </button>
                <button className="share-btn twitter" onClick={() => shareOnSocial("twitter")}>
                  Twitter
                </button>
                <button className="share-btn linkedin" onClick={() => shareOnSocial("linkedin")}>
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </article>

        <aside className="sidebar">
          <div className="recent-articles">
            <h3>Recent Articles</h3>
            {recentBlogs.map((recentBlog) => (
              <div key={recentBlog._id} className="recent-article-card">
                <div className="recent-article-image">
                  <img
                    src={getImageUrl(recentBlog.image) || "/placeholder.svg"}
                    alt={recentBlog.title}
                    className="recent-img"
                  />
                </div>
                <div className="recent-article-content">
                  <h4 className="recent-article-title">
                    <Link to={`/blog/${recentBlog._id}`}>{recentBlog.title}</Link>
                  </h4>
                  <p className="recent-article-date">{formatDate(recentBlog.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="back-to-blogs">
            <Link to="/blogs" className="back-btn">
              ← Back to All Articles
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default BlogReader
