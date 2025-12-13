import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

export default function FeaturedPosts({ posts }) {
  const [largePost, ...smallPosts] = posts

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Featured</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Large featured post */}
        {largePost && (
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <article>
              <div className="flex flex-wrap mb-2">
                {largePost.tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
              <h3 className="text-xl font-bold mb-2">
                <Link
                  href={`/blog/${largePost.slug}`}
                  className="text-gray-900 dark:text-gray-100 hover:text-primary-500"
                >
                  {largePost.title}
                </Link>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{largePost.summary}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <time dateTime={largePost.date}>{formatDate(largePost.date, siteMetadata.locale)}</time>
                <span className="mx-2">•</span>
                <Link
                  href={`/blog/${largePost.slug}`}
                  className="text-primary-500 hover:text-primary-600"
                >
                  Read more
                </Link>
              </div>
            </article>
          </div>
        )}
        {/* Small featured posts */}
        <div className="space-y-4">
          {smallPosts.map((post) => (
            <div key={post.slug} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <article>
                <div className="flex flex-wrap mb-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
                <h4 className="text-lg font-semibold mb-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-gray-900 dark:text-gray-100 hover:text-primary-500"
                  >
                    {post.title}
                  </Link>
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">{post.summary}</p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <time dateTime={post.date}>{formatDate(post.date, siteMetadata.locale)}</time>
                  <span className="mx-2">•</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary-500 hover:text-primary-600"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}