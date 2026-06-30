'use client'

import { useState } from 'react'

interface DiagramImageProps {
  src: string
  alt: string
  caption?: string
}

export function DiagramImage({ src, alt, caption }: DiagramImageProps) {
  const [zoomed, setZoomed] = useState(false)

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
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #c8860a, #f0a500, #ffd166)',
            borderRadius: '14px 14px 0 0',
            pointerEvents: 'none',
          }}
        />

        {/* Zoom trigger — a proper button wrapping the image */}
        <button
          type="button"
          onClick={() => setZoomed(true)}
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
            style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '6px' }}
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

      {zoomed && (
        <>
          {/* Backdrop — button so it's natively interactive */}
          <button
            type="button"
            aria-label="Close diagram zoom"
            onClick={() => setZoomed(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.92)',
              border: 'none',
              cursor: 'zoom-out',
              zIndex: 9999,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Image — positioned above backdrop */}
          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              pointerEvents: 'none',
            }}
          >
            <img
              src={src}
              alt=""
              style={{
                maxWidth: '95vw',
                maxHeight: '95vh',
                objectFit: 'contain',
                background: '#fff',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
              }}
            />
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Close"
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 10001,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </>
      )}
    </>
  )
}
