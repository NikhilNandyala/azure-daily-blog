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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      return
    }

    const searchTerm = query.toLowerCase()
    const filteredPosts = posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(searchTerm)
      const summaryMatch = post.summary?.toLowerCase().includes(searchTerm)
      const tagsMatch = post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))

      return titleMatch || summaryMatch || tagsMatch
    })

    setResults(filteredPosts)
  }, [query, posts])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-start justify-center bg-black pt-20">
      <div
        ref={modalRef}
        className="w-full max-w-2xl rounded-lg border border-white/6 bg-[#111827] p-6 shadow-xl"
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts by title, summary, or tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-body placeholder:text-muted w-full rounded-lg border border-white/6 bg-[#1F2937] px-4 py-3 pr-10 focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
          />
          <svg
            className="absolute top-3.5 right-3 h-5 w-5 text-gray-400"
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

        {query.trim() !== '' && (
          <div className="mt-4 max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="space-y-2">
                {results.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    onClick={onClose}
                    className="block rounded-lg border border-white/6 p-4 hover:bg-[#1F2937]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-body text-lg font-semibold">{post.title}</h3>
                        {post.summary && (
                          <p className="text-muted mt-1 line-clamp-2 text-sm">{post.summary}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-body inline-block rounded-full bg-[#374151] px-2 py-1 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-muted ml-4 flex flex-col items-end text-xs">
                        {post.featured && (
                          <span className="text-accent mb-1 rounded bg-[#1F2937] px-2 py-1">
                            Featured
                          </span>
                        )}
                        {post.pinned && (
                          <span className="text-inverse rounded bg-[#F59E0B] px-2 py-1">
                            Pinned
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-muted py-8 text-center">No posts found matching "{query}"</div>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="text-body rounded-lg bg-[#374151] px-4 py-2 text-sm font-medium hover:bg-[#4B5563]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
