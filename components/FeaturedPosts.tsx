interface FeaturedPostsProps {
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

import FeaturedPostCard from '@/components/FeaturedPostCard'

interface FeaturedPostsProps {
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

export default function FeaturedPosts({ posts, isAuthenticated = false }: FeaturedPostsProps) {
  const [largePost, ...smallPosts] = posts

  return (
    <section className="mb-12 w-full">
      <h2 className="text-body mb-6 text-2xl font-bold">Featured</h2>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        {/* Large featured post */}
        {largePost && (
          <div className="md:col-span-1">
            <FeaturedPostCard post={largePost} variant="large" isAuthenticated={isAuthenticated} />
          </div>
        )}
        {/* Right side: stacked two small posts */}
        <div className="grid grid-rows-2 gap-6 md:col-span-1">
          {smallPosts.slice(0, 2).map((post) => (
            <FeaturedPostCard
              key={post.slug}
              post={post}
              variant="small"
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
