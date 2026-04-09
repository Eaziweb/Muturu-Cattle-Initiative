// useScrollAnimation.js
// Drop this in your hooks/ folder and use it anywhere

import { useEffect, useRef } from "react"

/**
 * useScrollAnimation
 * Observes elements with .animate-on-scroll and adds .in-view when visible.
 * Also observes images with data-skeleton and reveals them on load.
 *
 * Usage:
 *   const containerRef = useScrollAnimation()
 *   <div ref={containerRef}> ... </div>
 *
 * Or call initScrollAnimations() manually for non-hook usage.
 */

export function useScrollAnimation() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current || document
    initScrollAnimations(root)
    initImageSkeletons(root)

    return () => {
      // Cleanup handled inside the functions
    }
  }, [])

  return ref
}

// ── Scroll animation observer ──────────────────────────────────────────────

export function initScrollAnimations(root = document) {
  const elements = root.querySelectorAll(".animate-on-scroll")
  if (!elements.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view")
          observer.unobserve(entry.target) // animate once
        }
      })
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px",
    }
  )

  elements.forEach((el) => observer.observe(el))
}

// ── Image skeleton reveal ──────────────────────────────────────────────────

export function initImageSkeletons(root = document) {
  const images = root.querySelectorAll(".img-wrapper img")

  images.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      // Already loaded (cached)
      revealImage(img)
    } else {
      img.addEventListener("load", () => revealImage(img), { once: true })
      img.addEventListener("error", () => revealImage(img), { once: true })
    }
  })
}

function revealImage(img) {
  img.classList.add("loaded")
  const skeleton = img.parentElement?.querySelector(".skeleton-img")
  if (skeleton) {
    skeleton.classList.add("hidden")
    setTimeout(() => skeleton.remove(), 500)
  }
}

// ── Count-up animation for impact numbers ─────────────────────────────────

export function initCountUpNumbers(root = document) {
  const cards = root.querySelectorAll(".home-impact-card")
  if (!cards.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const numberEl = entry.target.querySelector(".home-impact-number")
          if (numberEl && !numberEl.dataset.counted) {
            numberEl.dataset.counted = "true"
            const target = parseInt(numberEl.textContent.replace(/\D/g, ""), 10)
            countUp(numberEl, target)
          }
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.4 }
  )

  cards.forEach((card) => observer.observe(card))
}

function countUp(el, target, duration = 1500) {
  const start = performance.now()
  const suffix = el.dataset.suffix || ""

  const tick = (now) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = Math.round(eased * target) + suffix
    if (progress < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}