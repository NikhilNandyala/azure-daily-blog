import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

const MAX_DISPLAY = 10

export default function LatestPosts({ posts }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Latest</h2>
      <div className="space-y-8">
        {!posts.length && 'No posts found.'}
        {posts.slice(0, MAX_DISPLAY).map((post) => {
          const { slug, date, title, summary, tags } = post
          return (
            <article key={slug} className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0">
              <div className="flex flex-wrap mb-2">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
              <h3 className="text-xl font-bold mb-2">
                <Link
                  href={`/blog/${slug}`}
                  className="text-gray-900 dark:text-gray-100 hover:text-primary-500"
                >
                  {title}
                </Link>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{summary}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                <span className="mx-2">•</span>
                <Link
                  href={`/blog/${slug}`}
                  className="text-primary-500 hover:text-primary-600"
                >
                  Read more &rarr;
                </Link>
              </div>
            </article>
          )
        })}
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
          >
            View All Posts &rarr;
          </Link>
        </div>
      )}
    </section>
  )
}