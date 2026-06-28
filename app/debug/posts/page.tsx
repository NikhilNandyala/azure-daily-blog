import { getAllPosts } from '@/lib/content'

export default function DebugPostsPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Debug: Posts</h1>

      <div className="mb-8 rounded-lg bg-blue-100 p-4">
        <h2 className="text-xl font-semibold">Summary</h2>
        <ul className="mt-2 space-y-1">
          <li>Total Posts: {posts.length}</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Posts</h2>
        {posts.length === 0 ? (
          <div className="rounded-lg bg-yellow-100 p-4 text-yellow-800">
            No posts found. Create MDX files in data/blog/.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.slug} className="rounded-lg border border-gray-300 p-4">
                <div className="mb-2 font-semibold">{post.title}</div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Slug:</span>{' '}
                    <code className="rounded bg-gray-200 px-1">{post.slug}</code>
                  </div>
                  <div>
                    <span className="font-medium">URL:</span>{' '}
                    <a href={`/blog/${post.slug}`} className="text-blue-600 underline hover:text-blue-800">
                      /blog/{post.slug}
                    </a>
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(post.date).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Tags:</span>{' '}
                    {post.tags?.join(', ') || 'none'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
