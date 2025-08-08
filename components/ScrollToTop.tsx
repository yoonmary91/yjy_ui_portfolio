'use client'

import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full
                   text-gray-800 border border-gray-400
                   shadow-md shadow-gray-400 backdrop-blur-sm
                   hover:bg-white/10 hover:shadow-gray-500
                   hover:ring-2 hover:ring-white/30
                   hover:scale-105
                   transition-colors transition-transform transition-shadow duration-300
                   flex items-center justify-center"
      >
        🛰️
      </button>
    )
  )
}
