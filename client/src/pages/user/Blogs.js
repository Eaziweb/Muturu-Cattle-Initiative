"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import "../../styles/blogs.module.css"
import Navbar from "../../components/NavBar"

const Blogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [allTags, setAllTags] = useState([])

  useEffect(() => {
    fetchBlogs()
  }, [currentPage, searchTerm, selectedTag])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedTag && { tag: selectedTag }),
      })

      const response = await api.get(`/blogs?${params}`)
      setBlogs(response.data.blogs)
      setTotalPages(response.data.totalPages)

      const tags = [...new Set(response.data.blogs.flatMap((blog) => blog.tags))]
      setAllTags(tags)
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleTagFilter = (tag) => {
    setSelectedTag(tag === selectedTag ? "" : tag)
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getImageUrl = (image) => {
    if (!image) return "/blog-post.jpg"

    if (typeof image === "object" && image.url) {
      return image.url
    }

    return image
  }

  if (loading && currentPage === 1) {
    return (
      <div className="loading-container">
        <div className="loadingSpinner"></div>
        <p>Loading blogs...</p>
      </div>
    )
  }

  return (
    <div className="blogs-page">
             <Navbar />

      <div className="container">
        <div className="blogs-header">
          <h1>Research Blog</h1>
          <p>Stay updated with the latest insights and discoveries in Muturu cattle research</p>
        </div>

        <div className="blogs-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="tags-section">
            <h3>Filter by Topic</h3>
            <div className="tags-container">
              <button className={`tag-btn ${selectedTag === "" ? "active" : ""}`} onClick={() => handleTagFilter("")}>
                All Topics
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-btn ${selectedTag === tag ? "active" : ""}`}
                  onClick={() => handleTagFilter(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="blogs-grid">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <article key={blog._id} className="blog-card">
                <div className="blog-image">
                  <img src={getImageUrl(blog.image) || "/placeholder.svg"} alt={blog.title} loading="lazy" />
                  {blog.featured && <span className="featured-badge">Featured</span>}
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-author">By {blog.author}</span>
                    <span className="blog-date">{formatDate(blog.createdAt)}</span>
                  </div>
                  <h2 className="blog-title">
                    <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                  </h2>
                  <p className="blog-excerpt">{blog.excerpt}</p>
                  <div className="blog-tags">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="blog-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="blog-footer">
                    <Link to={`/blog/${blog._id}`} className="read-more-btn">
                      Read More
                    </Link>
                    <span className="blog-views">{blog.views} views</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="no-blogs">
              <h3>No articles found</h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blogs
