"use client"

import { useState, useEffect } from "react"
import api from "../../utils/api"
import styles from "../../styles/Gallery.module.css"
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
      <div className={styles["loading-container"]}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading galleries...</p>
      </div>
    )
  if (error) return <div className={styles["error-container"]}>{error}</div>

  return (
    <div className={styles["gallery-page"]}>
      <Navbar />

      <div className={styles["gallery-hero"]}>
        <h1>Photo Gallery</h1>
        <p>Explore our collection of memorable moments from events, research activities, and field work</p>
      </div>

      {galleries.length === 0 ? (
        <div className={styles["no-galleries"]}>
          <h3>No galleries available</h3>
          <p>Check back later for photo collections!</p>
        </div>
      ) : (
        <div className={styles["galleries-container"]}>
          {galleries.map((gallery) => (
            <div key={gallery._id} className={styles["gallery-card"]} onClick={() => openGalleryModal(gallery)}>
              <div className={styles["gallery-preview-grid"]}>
                {gallery.images.length > 0 ? (
                  <>
                    <div className={styles["main-preview"]}>
                      <img src={getImageUrl(gallery.images[0]) || "/placeholder.svg"} alt="Main preview" />
                    </div>
                    {gallery.images.length > 1 && (
                      <div className={styles["secondary-previews"]}>
                        {gallery.images.slice(1, 4).map((image, index) => (
                          <div key={index} className={styles["secondary-preview"]}>
                            <img src={getImageUrl(image) || "/placeholder.svg"} alt={`Preview ${index + 2}`} />
                          </div>
                        ))}
                        {gallery.images.length > 4 && (
                          <div className={styles["more-images-overlay"]}>
                            <span>+{gallery.images.length - 4} more</span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles["no-images-placeholder"]}>
                    <span>📷</span>
                    <p>No images</p>
                  </div>
                )}
              </div>
              <div className={styles["gallery-info"]}>
                <h2>{gallery.title}</h2>
                <p>{gallery.description}</p>
                <div className={styles["gallery-meta"]}>
                  <span className={styles["image-count"]}>📸 {gallery.images.length} photos</span>
                  <span className={styles["view-gallery"]}>View Gallery →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGallery && (
        <div className={styles["modal-overlay"]} onClick={closeGalleryModal}>
          <div className={styles["gallery-modal"]} onClick={(e) => e.stopPropagation()}>
            <button className={styles["close-modal"]} onClick={closeGalleryModal}>
              ×
            </button>

            <div className={styles["modal-header"]}>
              <h2>{selectedGallery.title}</h2>
              <p>{selectedGallery.description}</p>
              <span className={styles["photo-count"]}>{selectedGallery.images.length} Photos</span>
            </div>

            <div className={styles["modal-images-grid"]}>
              {selectedGallery.images.map((image, index) => (
                <div
                  key={index}
                  className={styles["modal-image-item"]}
                  onClick={() => openImageModal(image, selectedGallery, index)}
                >
                  <img src={getImageUrl(image) || "/placeholder.svg"} alt={image.caption || `Image ${index + 1}`} />
                  {image.caption && (
                    <div className={styles["image-caption-overlay"]}>
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
        <div className={styles["lightbox-overlay"]} onClick={closeImageModal}>
          <button className={styles["close-lightbox"]} onClick={closeImageModal}>
            ×
          </button>
          <button
            className={`${styles["lightbox-nav"]} ${styles.prev}`}
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
          >
            ‹
          </button>
          <button
            className={`${styles["lightbox-nav"]} ${styles.next}`}
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
          >
            ›
          </button>

          <div className={styles["lightbox-content"]} onClick={(e) => e.stopPropagation()}>
            <img src={getImageUrl(selectedImage) || "/placeholder.svg"} alt={selectedImage.caption} />
            {selectedImage.caption && (
              <div className={styles["lightbox-caption"]}>
                <h4>{selectedImage.galleryTitle}</h4>
                <p>{selectedImage.caption}</p>
                <span className={styles["image-counter"]}>
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