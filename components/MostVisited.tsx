import Link from '@/components/Link'
import { PostListItem } from '@/lib/sanity/types'
import SidebarCard from '@/components/SidebarCard'

interface MostVisitedProps {
  posts: PostListItem[]
}

/**
 * MostVisited Widget - Displays top 5 most visited blog posts
 *
 * Initial ranking strategy (fallback when views not available):
 * 1. Featured posts first
 * 2. Then by newest (publishedAt)
 *
 * Future enhancement: Will rank by actual view counts from Sanity
 */
export default function MostVisited({ posts }: MostVisitedProps) {
  // Rank posts: featured first, then by views (or publishedAt as fallback)
  const rankedPosts = [...posts]
    .sort((a, b) => {
      // If views field exists and is populated, use it
      const viewsA = (a as PostListItem & { views?: number }).views || 0
      const viewsB = (b as PostListItem & { views?: number }).views || 0

      if (viewsA !== viewsB) {
        return viewsB - viewsA // Higher views first
      }

      // Fallback 1: Featured posts first
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1
      }

      // Fallback 2: Newest first
      const dateA = new Date(a.publishedAt || 0).getTime()
      const dateB = new Date(b.publishedAt || 0).getTime()
      return dateB - dateA
    })
    .slice(0, 5) // Top 5 posts

  return (
    <SidebarCard title="Most Visited">
      <div className="space-y-4">
        {rankedPosts.map((post, index) => {
          const postUrl = `/blog/${post.slug.current}`
          const views = (post as PostListItem & { views?: number }).views

          return (
            <div key={post._id} className="group">
              <Link href={postUrl} className="block">
                <div className="flex items-start gap-3">
                  {/* Rank Number */}
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      index === 0
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 text-gray-400 group-hover:bg-blue-500/20 group-hover:text-blue-400'
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Post Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-medium text-gray-200 transition-colors group-hover:text-blue-400">
                      {post.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      {views !== undefined && views > 0 ? (
                        <>
                          <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <span>{views.toLocaleString()} views</span>
                        </>
                      ) : (
                        <>
                          {post.featured && (
                            <span className="inline-flex items-center gap-1 text-blue-400">
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              Featured
                            </span>
                          )}
                          {post.publishedAt && (
                            <span>
                              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}

        {rankedPosts.length === 0 && (
          <p className="text-sm text-gray-500">No posts available yet.</p>
        )}
      </div>
    </SidebarCard>
  )
}
