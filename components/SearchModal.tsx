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
  postType?: string
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
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Blurred backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5,13,26,0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 40,
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        style={{
          position: 'fixed',
          top: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '92%',
          maxWidth: '620px',
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, rgba(15,31,56,0.99), rgba(10,22,40,0.99))',
          border: '1px solid rgba(200,134,10,0.35)',
          borderRadius: '16px',
          padding: '20px',
          zIndex: 50,
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(200,134,10,0.1) inset',
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', marginBottom: '4px' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts by title, tags, or content…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#f0a500'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(240,165,0,0.15)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200,134,10,0.4)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            style={{
              width: '100%',
              background: 'rgba(5,13,26,0.9)',
              border: '1px solid rgba(200,134,10,0.4)',
              borderRadius: '10px',
              padding: '12px 44px 12px 16px',
              fontSize: '14px',
              color: '#ffeaa0',
              outline: 'none',
              caretColor: '#f0a500',
              marginBottom: '14px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          />
          <svg
            style={{
              position: 'absolute',
              top: '21px',
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Results scroll area */}
        <div
          className="search-results"
          style={{
            overflowY: 'auto',
            flex: 1,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          } as React.CSSProperties}
        >
          {query.trim() !== '' && (
            <>
              {results.length > 0 ? (
                <div>
                  {results.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      onClick={onClose}
                      style={{
                        display: 'block',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        marginBottom: '4px',
                        cursor: 'pointer',
                        border: '0.5px solid transparent',
                        textDecoration: 'none',
                        transition: 'all .15s',
                      }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLElement).style.background = 'rgba(200,134,10,0.08)'
                        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,134,10,0.25)'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                        ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
                      }}
                    >
                      {/* Meta: postType + date */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        {post.postType && (
                          <span style={{
                            fontSize: '10px',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: 'rgba(200,134,10,0.08)',
                            border: '0.5px solid rgba(200,134,10,0.2)',
                            color: '#8a7a5a',
                          }}>
                            {post.postType}
                          </span>
                        )}
                        <span style={{ fontSize: '10px', color: '#6a5a3a', marginLeft: 'auto' }}>
                          {post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                        </span>
                      </div>

                      {/* Title */}
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffeaa0', marginBottom: '3px' }}>
                        {post.title}
                      </div>

                      {/* Excerpt */}
                      {post.summary && (
                        <div style={{
                          fontSize: '11px',
                          color: '#8a7a5a',
                          lineHeight: 1.5,
                          marginBottom: '6px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        } as React.CSSProperties}>
                          {post.summary}
                        </div>
                      )}

                      {/* Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {post.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: '10px',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: 'rgba(200,134,10,0.08)',
                              border: '0.5px solid rgba(200,134,10,0.25)',
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
                <div style={{ textAlign: 'center', padding: '32px 20px', color: '#6a5a3a', fontSize: '13px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>🔍</div>
                  <div style={{ color: '#8a7a5a', marginBottom: '4px' }}>No posts found for &ldquo;{query}&rdquo;</div>
                  <div style={{ fontSize: '11px', color: '#6a5a3a' }}>Try searching for a tag, topic, or Azure service</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          fontSize: '10px',
          color: '#6a5a3a',
          textAlign: 'center',
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '0.5px solid rgba(200,134,10,0.1)',
          flexShrink: 0,
        }}>
          Press <span style={{ color: '#8a7a5a', fontFamily: 'monospace' }}>ESC</span> or click outside to close
          {results.length > 0 && (
            <span style={{ marginLeft: '12px' }}>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </>
  )
}
