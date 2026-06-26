'use client'

import { useEffect, useRef, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('article h2[id], article h3[id]'))
    const items: Heading[] = els.map((el) => ({
      id: el.id,
      text: el.textContent || '',
      level: el.tagName === 'H2' ? 2 : 3,
    }))
    setHeadings(items)
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    observerRef.current?.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <p className="text-muted mb-3 text-xs font-semibold tracking-wider uppercase">
        On this page
      </p>
      <ul className="space-y-1.5 text-sm">
        {headings.map(({ id, text, level }) => (
          <li key={id} className={level === 3 ? 'ml-3' : ''}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`block truncate py-0.5 transition-colors ${
                activeId === id
                  ? 'font-medium text-blue-400'
                  : 'text-muted hover:text-blue-400'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
