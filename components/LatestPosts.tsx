import PostListItem from '@/components/PostListItem'
import Link from '@/components/Link'

interface LatestPostsProps {
  posts: Array<{
    slug: string
    date: string
    title: string
    summary?: string
    tags: string[]
  }>
}

const MAX_DISPLAY = 10

export default function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Latest</h2>
      <div className="space-y-8">
        {!posts.length && 'No posts found.'}
        {posts.slice(0, MAX_DISPLAY).map((post) => (
          <PostListItem key={post.slug} post={post} />
        ))}
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
          >
            View All Posts →
          </Link>
        </div>
      )}
    </section>
  )
}