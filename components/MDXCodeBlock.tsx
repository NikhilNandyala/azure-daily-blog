'use client'

import { useState, useRef, type ReactNode } from 'react'

export function MDXCodeBlock({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable — fail silently
    }
  }

  return (
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
      <button
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy code'}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(200,134,10,0.1)',
          border: `0.5px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(200,134,10,0.3)'}`,
          borderRadius: '6px',
          padding: '5px 10px',
          fontSize: '11px',
          fontWeight: 600,
          color: copied ? '#22c55e' : '#f0a500',
          cursor: 'pointer',
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: '0.04em',
          transition: 'background 0.15s, border-color 0.15s, color 0.15s',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          zIndex: 2,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          lineHeight: 1,
        }}
      >
        {copied ? (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            COPIED
          </>
        ) : (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            COPY
          </>
        )}
      </button>

      <pre
        ref={preRef}
        style={{
          background: 'rgba(10,22,40,0.98)',
          border: '1px solid rgba(0,120,212,0.2)',
          borderRadius: 10,
          padding: '1.25rem',
          paddingTop: '2.75rem',
          margin: 0,
          fontSize: '0.875rem',
          lineHeight: 1.7,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          overflowX: 'auto',
          overflowY: 'hidden',
          maxWidth: '100%',
          width: '100%',
          boxSizing: 'border-box',
          whiteSpace: 'pre',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(200,134,10,0.3) transparent',
        }}
      >
        {children}
      </pre>
    </div>
  )
}
