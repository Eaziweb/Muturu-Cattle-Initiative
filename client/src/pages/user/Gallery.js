"use client"

import { useState, useEffect } from "react"
import api from "../../utils/api"
import "../../styles/Gallery.module.css"
import Navbar from "../../components/NavBar"

const Gallery = () => {
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedGallery, setSelectedGallery] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchGalleries()
  }, [])

  const fetchGalleries = async () => {
    try {
      setLoading(true)
      const response = await api.get("/gallery")
      setGalleries(response.data)
    } catch (error) {
      setError("Failed to fetch galleries")
      console.error("Error fetching galleries:", error)
    } finally {
      setLoading(false)
    }
  }

  const openGalleryModal = (gallery) => {
    setSelectedGallery(gallery)
  }

  const closeGalleryModal = () => {
    setSelectedGallery(null)
  }

  const openImageModal = (image, gallery, index) => {
    setSelectedImage({ ...image, galleryTitle: gallery.title, images: gallery.images })
    setCurrentImageIndex(index)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage && selectedImage.images) {
      const nextIndex = (currentImageIndex + 1) % selectedImage.images.length
      setCurrentImageIndex(nextIndex)
      setSelectedImage({
        ...selectedImage.images[nextIndex],
        galleryTitle: selectedImage.galleryTitle,
        images: selectedImage.images,
      })
    }
  }

  const prevImage = () => {
    if (selectedImage && selectedImage.images) {
      const prevIndex = (currentImageIndex - 1 + selectedImage.images.length) % selectedImage.images.length
      setCurrentImageIndex(prevIndex)
      setSelectedImage({
        ...selectedImage.images[prevIndex],
        galleryTitle: selectedImage.galleryTitle,
        images: selectedImage.images,
      })
    }
  }

  const getImageUrl = (image) => {
    if (!image) return "/images/gallery-placeholder.jpg"
    if (typeof image === "object" && image.url) {
      return image.url
    }
    return image
  }

  if (loading)
    return (
      <div className="loading-container">
        <div className="loadingSpinner"></div>
        <p>Loading galleries...</p>
      </div>
    )
  if (error) return <div className="error-container">{error}</div>

  return (
    <div className="gallery-page">
                   <Navbar />

      <div className="gallery-hero">
        <h1>Photo Gallery</h1>
        <p>Explore our collection of memorable moments from events, research activities, and field work</p>
      </div>

      {galleries.length === 0 ? (
        <div className="no-galleries">
          <h3>No galleries available</h3>
          <p>Check back later for photo collections!</p>
        </div>
      ) : (
        <div className="galleries-container">
          {galleries.map((gallery) => (
            <div key={gallery._id} className="gallery-card" onClick={() => openGalleryModal(gallery)}>
              <div className="gallery-preview-grid">
                {gallery.images.length > 0 ? (
                  <>
                    <div className="main-preview">
                      <img src={getImageUrl(gallery.images[0]) || "/placeholder.svg"} alt="Main preview" />
                    </div>
                    {gallery.images.length > 1 && (
                      <div className="secondary-previews">
                        {gallery.images.slice(1, 4).map((image, index) => (
                          <div key={index} className="secondary-preview">
                            <img src={getImageUrl(image) || "/placeholder.svg"} alt={`Preview ${index + 2}`} />
                          </div>
                        ))}
                        {gallery.images.length > 4 && (
                          <div className="more-images-overlay">
                            <span>+{gallery.images.length - 4} more</span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="no-images-placeholder">
                    <span>📷</span>
                    <p>No images</p>
                  </div>
                )}
              </div>
              <div className="gallery-info">
                <h2>{gallery.title}</h2>
                <p>{gallery.description}</p>
                <div className="gallery-meta">
                  <span className="image-count">📸 {gallery.images.length} photos</span>
                  <span className="view-gallery">View Gallery →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGallery && (
        <div className="modal-overlay" onClick={closeGalleryModal}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeGalleryModal}>
              ×
            </button>

            <div className="modal-header">
              <h2>{selectedGallery.title}</h2>
              <p>{selectedGallery.description}</p>
              <span className="photo-count">{selectedGallery.images.length} Photos</span>
            </div>

            <div className="modal-images-grid">
              {selectedGallery.images.map((image, index) => (
                <div
                  key={index}
                  className="modal-image-item"
                  onClick={() => openImageModal(image, selectedGallery, index)}
                >
                  <img src={getImageUrl(image) || "/placeholder.svg"} alt={image.caption || `Image ${index + 1}`} />
                  {image.caption && (
                    <div className="image-caption-overlay">
                      <p>{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="lightbox-overlay" onClick={closeImageModal}>
          <button className="close-lightbox" onClick={closeImageModal}>
            ×
          </button>
          <button
            className="lightbox-nav prev"
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
          >
            ‹
          </button>
          <button
            className="lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
          >
            ›
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={getImageUrl(selectedImage) || "/placeholder.svg"} alt={selectedImage.caption} />
            {selectedImage.caption && (
              <div className="lightbox-caption">
                <h4>{selectedImage.galleryTitle}</h4>
                <p>{selectedImage.caption}</p>
                <span className="image-counter">
                  {currentImageIndex + 1} / {selectedImage.images.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
