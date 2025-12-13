import FeaturedPostCard from '@/components/FeaturedPostCard'

interface FeaturedPostsProps {
  posts: Array<{
    slug: string
    date: string
    title: string
    summary: string
    tags: string[]
  }>
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  const [largePost, ...smallPosts] = posts

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Featured</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Large featured post */}
        {largePost && (
          <div className="md:col-span-2">
            <FeaturedPostCard post={largePost} variant="large" />
          </div>
        )}
        {/* Small featured posts */}
        <div className="space-y-4">
          {smallPosts.map((post) => (
            <FeaturedPostCard key={post.slug} post={post} variant="small" />
          ))}
        </div>
      </div>
    </section>
  )
}