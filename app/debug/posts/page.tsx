import { getClientOrNull } from '@/lib/sanity/getClient'

interface PostDebugInfo {
  title: string
  slug: {
    current: string
  }
  status: string
  publishedAt: string
  _id: string
}

async function getDebugPosts() {
  const client = getClientOrNull()
  if (!client) {
    return { configured: false, posts: [] }
  }

  try {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      status,
      publishedAt
    }`
    const posts = await client.fetch<PostDebugInfo[]>(query)
    return { configured: true, posts }
  } catch (error) {
    console.error('Error fetching debug posts:', error)
    return { configured: true, posts: [], error: String(error) }
  }
}

export default async function DebugPostsPage() {
  const { configured, posts, error } = await getDebugPosts()

  if (!configured) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Debug: Posts</h1>
        <div className="rounded-lg bg-yellow-100 p-4 text-yellow-800">
          <p className="font-semibold">⚠️ Sanity Not Configured</p>
          <p className="mt-2">Sanity environment variables are not set. Please configure:</p>
          <ul className="mt-2 ml-6 list-disc">
            <li>NEXT_PUBLIC_SANITY_PROJECT_ID</li>
            <li>NEXT_PUBLIC_SANITY_DATASET</li>
          </ul>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Debug: Posts</h1>
        <div className="rounded-lg bg-red-100 p-4 text-red-800">
          <p className="font-semibold">❌ Error Fetching Posts</p>
          <pre className="mt-2 overflow-auto text-sm">{error}</pre>
        </div>
      </div>
    )
  }

  const publishedPosts = posts.filter((p) => p.status === 'published')
  const draftPosts = posts.filter((p) => p.status === 'draft')

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Debug: Posts</h1>

      <div className="mb-8 rounded-lg bg-blue-100 p-4">
        <h2 className="text-xl font-semibold">Summary</h2>
        <ul className="mt-2 space-y-1">
          <li>Total Posts: {posts.length}</li>
          <li>Published: {publishedPosts.length}</li>
          <li>Draft: {draftPosts.length}</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Published Posts</h2>
        {publishedPosts.length === 0 ? (
          <div className="rounded-lg bg-yellow-100 p-4 text-yellow-800">
            No published posts found. Check that posts have status="published" in Sanity.
          </div>
        ) : (
          <div className="space-y-4">
            {publishedPosts.map((post) => (
              <div key={post._id} className="rounded-lg border border-gray-300 p-4">
                <div className="mb-2 font-semibold">{post.title}</div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Slug:</span>{' '}
                    <code className="rounded bg-gray-200 px-1">{post.slug.current}</code>
                  </div>
                  <div>
                    <span className="font-medium">Expected URL:</span>{' '}
                    <a
                      href={`/blog/${post.slug.current}`}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      /blog/{post.slug.current}
                    </a>
                  </div>
                  <div>
                    <span className="font-medium">Published:</span>{' '}
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleString() : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">ID:</span>{' '}
                    <code className="text-xs">{post._id}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {draftPosts.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Draft Posts</h2>
          <div className="space-y-4">
            {draftPosts.map((post) => (
              <div key={post._id} className="rounded-lg border border-gray-300 p-4 opacity-60">
                <div className="mb-2 font-semibold">{post.title}</div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Slug:</span>{' '}
                    <code className="rounded bg-gray-200 px-1">{post.slug.current}</code>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> Draft (not shown on site)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
