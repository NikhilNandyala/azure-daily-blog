import Link from '@/components/Link'
import TagChip from '@/components/TagChip'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

interface PostListItemProps {
  post: {
    slug: string
    date: string
    title: string
    summary: string
    tags: string[]
  }
}

const PostListItem = ({ post }: PostListItemProps) => {
  return (
    <article className="border-b border-gray-200 dark:border-gray-700 pb-8 mb-8 last:border-b-0 last:pb-0 last:mb-0">
      <div className="flex flex-wrap mb-3">
        {post.tags.map((tag) => (
          <TagChip key={tag} text={tag} />
        ))}
      </div>
      <h3 className="text-xl font-bold mb-3 leading-tight">
        <Link
          href={`/blog/${post.slug}`}
          className="text-gray-900 dark:text-gray-100 hover:text-primary-500 transition-colors"
        >
          {post.title}
        </Link>
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{post.summary}</p>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <time dateTime={post.date}>{formatDate(post.date, siteMetadata.locale)}</time>
        <span className="mx-2">•</span>
        <Link
          href={`/blog/${post.slug}`}
          className="text-primary-500 hover:text-primary-600 transition-colors"
        >
          Read more →
        </Link>
      </div>
    </article>
  )
}

export default PostListItem