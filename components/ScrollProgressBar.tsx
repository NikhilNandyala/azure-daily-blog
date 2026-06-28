'use client'

import { useEffect, useState } from 'react'

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY
      const total =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-50 h-1 w-full">
      <div
        className="h-full transition-[width] duration-75"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #c8860a, #f0a500, #ffd166)',
          boxShadow: '0 0 8px rgba(240,165,0,0.6)',
        }}
      />
    </div>
  )
}
