'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface DiagramImageProps {
  src: string
  alt: string
  caption?: string
}

export function DiagramImage({ src, alt, caption }: DiagramImageProps) {
  const [zoomed, setZoomed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Portal needs document — only available after hydration
  useEffect(() => { setMounted(true) }, [])

  // ESC to close + lock body scroll while zoomed
  useEffect(() => {
    if (!zoomed) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoomed(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [zoomed])

  const overlay = zoomed && mounted
    ? createPortal(
        // backdrop — native button so click-to-close is keyboard accessible
        <button
          type="button"
          aria-label="Close diagram zoom"
          onClick={() => setZoomed(false)}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.94)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 999999,
            border: 'none',
            cursor: 'zoom-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: '95vw',
              maxHeight: '92vh',
              objectFit: 'contain',
              background: '#fff',
              padding: '16px',
              borderRadius: '10px',
              boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
              cursor: 'zoom-out',
            }}
          />

          {/* Close X — stopPropagation not needed since backdrop already closes */}
          <span
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            ✕
          </span>

          <span
            aria-hidden="true"
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            click or press ESC to close
          </span>
        </button>,
        document.body
      )
    : null

  return (
    <>
      <figure
        style={{
          margin: '2rem 0',
          background: '#ffffff',
          padding: '20px',
          borderRadius: '14px',
          border: '0.5px solid rgba(200,134,10,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          position: 'relative',
        }}
      >
        {/* Gold accent line */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #c8860a, #f0a500, #ffd166)',
            borderRadius: '14px 14px 0 0',
            pointerEvents: 'none',
          }}
        />

        <button
          type="button"
          onClick={() => setZoomed(true)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setZoomed(true) } }}
          aria-label={`View full-size: ${alt}`}
          style={{
            display: 'block',
            width: '100%',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'zoom-in',
          }}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            draggable={false}
            style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '6px', pointerEvents: 'none' }}
          />
        </button>

        {caption && (
          <figcaption
            style={{
              marginTop: '12px',
              fontSize: '12px',
              color: '#6b7280',
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            {caption}
          </figcaption>
        )}

        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '12px',
            fontSize: '10px',
            color: '#9ca3af',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
          }}
        >
          click to zoom
        </span>
      </figure>

      {overlay}
    </>
  )
}
