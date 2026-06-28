import Link from '@/components/Link'
import type { Blog } from 'contentlayer/generated'
import SidebarCard from '@/components/SidebarCard'

interface MostVisitedProps {
  posts: Blog[]
}

export default function MostVisited({ posts }: MostVisitedProps) {
  const rankedPosts = [...posts]
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 5)

  return (
    <SidebarCard title="Most Visited">
      <div className="space-y-4">
        {rankedPosts.map((post, index) => {
          const postUrl = `/blog/${post.slug}`

          return (
            <div key={post.slug} className="group">
              <Link href={postUrl} className="block">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={
                      index === 0
                        ? { background: 'linear-gradient(135deg, var(--azure), #0063b1)', boxShadow: '0 0 10px var(--azure-glow)' }
                        : { background: 'var(--surface-2)', color: 'var(--muted)' }
                    }
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className="line-clamp-2 text-sm font-medium transition-colors group-hover:text-[var(--link)]"
                      style={{ color: 'var(--text)' }}
                    >
                      {post.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                      {post.featured && (
                        <span className="inline-flex items-center gap-1" style={{ color: 'var(--link)' }}>
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          Featured
                        </span>
                      )}
                      <span>
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}

        {rankedPosts.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            No posts available yet.
          </p>
        )}
      </div>
    </SidebarCard>
  )
}
