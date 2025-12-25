'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  slug: string
}

/**
 * ViewTracker - Client component to safely increment post views
 *
 * - Runs only in browser (client-side)
 * - Increments view count once per page load
 * - Fails silently to not disrupt user experience
 */
export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return

    // Increment view count
    const incrementViews = async () => {
      try {
        await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug }),
        })
      } catch (error) {
        // Fail silently - don't disrupt user experience
        console.debug('View tracking failed:', error)
      }
    }

    // Small delay to avoid blocking initial render
    const timer = setTimeout(() => {
      incrementViews()
    }, 1000)

    return () => clearTimeout(timer)
  }, [slug])

  // This component doesn't render anything
  return null
}
