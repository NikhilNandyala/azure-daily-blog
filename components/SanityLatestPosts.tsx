import SanityPostCard from '@/components/SanityPostCard'
import Link from '@/components/Link'
import type { Blog } from 'contentlayer/generated'

interface SanityLatestPostsProps {
  posts: Blog[]
  isAuthenticated?: boolean
  limit?: number
}

export default function SanityLatestPosts({
  posts,
  isAuthenticated = false,
  limit = 10,
}: SanityLatestPostsProps) {
  const displayPosts = limit > 0 ? posts.slice(0, limit) : posts

  return (
    <section className="w-full">
      <h2 className="text-body mb-6 text-2xl font-bold">Latest</h2>
      <div className="post-list w-full space-y-4">
        {!displayPosts.length && (
          <p className="text-muted">
            No posts found. Create MDX files in data/blog/ to see them here.
          </p>
        )}
        {displayPosts.map((post) => (
          <SanityPostCard key={post.slug} post={post} isAuthenticated={isAuthenticated} />
        ))}
      </div>
      {posts.length > limit && (
        <div className="mt-8">
          <Link href="/blog" className="text-accent hover:text-primary-300 font-medium">
            View All Posts →
          </Link>
        </div>
      )}
    </section>
  )
}
