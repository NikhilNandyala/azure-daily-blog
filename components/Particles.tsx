'use client'

import { useEffect, useRef } from 'react'

export function Particles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles: HTMLDivElement[] = []

    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div')
      const duration = 6 + Math.random() * 8
      const delay = Math.random() * 8
      const left = Math.random() * 100
      const top = 80 + Math.random() * 20

      p.style.cssText = [
        'position:absolute',
        'width:2px',
        'height:2px',
        'background:#0078d4',
        'border-radius:50%',
        `left:${left}%`,
        `top:${top}%`,
        `animation:float-up ${duration}s linear ${delay}s infinite`,
        'opacity:0',
      ].join(';')

      container.appendChild(p)
      particles.push(p)
    }

    return () => {
      particles.forEach((p) => p.remove())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  )
}
