import PostListItem from '@/components/PostListItem'
import Link from '@/components/Link'

interface LatestPostsProps {
  posts: Array<{
    slug: string
    date: string
    title: string
    summary?: string
    tags: string[]
    featured?: boolean
    pinned?: boolean
    membersOnly?: boolean
  }>
}

const MAX_DISPLAY = 10

interface LatestPostsProps {
  posts: Array<{
    slug: string
    date: string
    title: string
    summary?: string
    tags: string[]
    featured?: boolean
    pinned?: boolean
    membersOnly?: boolean
  }>
  isAuthenticated?: boolean
}

export default function LatestPosts({ posts, isAuthenticated = false }: LatestPostsProps) {
  return (
    <section className="w-full">
      <h2 className="text-body mb-6 text-2xl font-bold">Latest</h2>
      <div className="w-full space-y-8">
        {!posts.length && 'No posts found.'}
        {posts.slice(0, MAX_DISPLAY).map((post) => (
          <PostListItem key={post.slug} post={post} isAuthenticated={isAuthenticated} />
        ))}
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="mt-8">
          <Link href="/blog" className="text-accent hover:text-primary-300 font-medium">
            View All Posts →
          </Link>
        </div>
      )}
    </section>
  )
}
