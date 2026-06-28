import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllPublishedPosts, getTagsWithCounts } from '@/lib/sanity/queries'
import SanityLatestPosts from '@/components/SanityLatestPosts'
import SanityPopularTags from '@/components/SanityPopularTags'
import MostVisited from '@/components/MostVisited'

// Revalidate every hour (3600 seconds)
export const revalidate = 3600

export default async function Page() {
  const session = await getServerSession(authOptions)
  const isAuthenticated = Boolean(session)

  // Fetch all published posts from Sanity
  const posts = await getAllPublishedPosts(100, 0) // Get up to 100 posts
  const tagsWithCounts = await getTagsWithCounts()

  return (
    <>
      {/* Hero section */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--surface-2) 0%, rgba(0,120,212,0.08) 100%)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '32px 36px',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top shimmer line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              'linear-gradient(90deg, transparent, var(--azure), var(--cyan), transparent)',
          }}
        />

        {/* Live badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(200,134,10,0.10)',
            border: '1px solid rgba(200,134,10,0.30)',
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: 11,
            color: '#f0a500',
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              background: '#f0a500',
              borderRadius: '50%',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
          Live · Azure engineering insights
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3, marginBottom: 8, color: 'var(--text)' }}>
          Real Azure problems.<br />
          <span className="gradient-text">Real fixes.</span>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          Deep-dives on networking, IaC, and cloud architecture — written by engineers in the
          field.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Main Content */}
        <div className="col-span-1 lg:col-span-8">
          <SanityLatestPosts posts={posts} isAuthenticated={isAuthenticated} limit={0} />
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-6 lg:col-span-4">
          <MostVisited posts={posts} />
          <SanityPopularTags tags={tagsWithCounts} limit={10} />
        </div>
      </div>
    </>
  )
}
