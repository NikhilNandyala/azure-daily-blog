'use client'

import { useState, useEffect, useRef } from 'react'
import Link from './Link'

interface Post {
  slug: string
  date: string
  title: string
  summary?: string
  tags: string[]
  featured?: boolean
  pinned?: boolean
  membersOnly?: boolean
}

interface SearchModalProps {
  posts: Post[]
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ posts, isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Post[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [inputFocused, setInputFocused] = useState(false)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() === '') {
        setResults([])
        return
      }
      const q = query.toLowerCase()
      setResults(
        posts.filter(
          (post) =>
            post.title.toLowerCase().includes(q) ||
            (post.summary ?? '').toLowerCase().includes(q) ||
            post.tags.some((tag) => tag.toLowerCase().includes(q))
        )
      )
    }, 200)
    return () => clearTimeout(timer)
  }, [query, posts])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Blurred backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 13, 26, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 40,
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        ref={modalRef}
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '580px',
          background: 'linear-gradient(135deg, rgba(15,31,56,0.98), rgba(10,22,40,0.99))',
          border: '1px solid rgba(200,134,10,0.3)',
          borderRadius: '16px',
          padding: '24px',
          zIndex: 50,
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts by title, tags, or content…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            style={{
              background: 'rgba(5,13,26,0.8)',
              border: `1px solid ${inputFocused ? '#f0a500' : 'rgba(200,134,10,0.3)'}`,
              borderRadius: '10px',
              color: '#ffeaa0',
              padding: '12px 44px 12px 16px',
              fontSize: '14px',
              width: '100%',
              outline: 'none',
              transition: 'border-color 0.15s',
              boxSizing: 'border-box',
            }}
          />
          <svg
            style={{
              position: 'absolute',
              top: '50%',
              right: '14px',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              color: '#8a7a5a',
              pointerEvents: 'none',
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Results */}
        {query.trim() !== '' && (
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {results.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    onClick={onClose}
                    style={{
                      display: 'block',
                      borderRadius: '10px',
                      border: '0.5px solid rgba(200,134,10,0.15)',
                      padding: '14px 16px',
                      background: 'rgba(10,22,40,0.6)',
                      textDecoration: 'none',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,134,10,0.4)'
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(15,31,56,0.8)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,134,10,0.15)'
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(10,22,40,0.6)'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#ffeaa0',
                        marginBottom: '4px',
                        lineHeight: 1.4,
                      }}
                    >
                      {post.title}
                    </div>
                    {post.summary && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#8a7a5a',
                          marginBottom: '8px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {post.summary.slice(0, 100)}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {post.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '10px',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            background: 'rgba(200,134,10,0.1)',
                            border: '1px solid rgba(200,134,10,0.25)',
                            color: '#d4a843',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '32px 0',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: '#8a7a5a',
                }}
              >
                No posts found for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              fontSize: '12px',
              color: '#8a7a5a',
              background: 'transparent',
              border: '1px solid rgba(200,134,10,0.2)',
              borderRadius: '6px',
              padding: '6px 14px',
              cursor: 'pointer',
            }}
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </>
  )
}
