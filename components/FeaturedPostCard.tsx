import Link from '@/components/Link'
import TagChip from '@/components/TagChip'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

interface FeaturedPostCardProps {
  post: {
    slug: string
    date: string
    title: string
    summary: string
    tags: string[]
  }
  variant?: 'large' | 'small'
}

const FeaturedPostCard = ({ post, variant = 'small' }: FeaturedPostCardProps) => {
  const isLarge = variant === 'large'

  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 ${isLarge ? '' : 'h-full'}`}>
      <article>
        <div className="flex flex-wrap mb-3">
          {post.tags.slice(0, isLarge ? 3 : 2).map((tag) => (
            <TagChip key={tag} text={tag} />
          ))}
        </div>
        <h3 className={`font-bold mb-3 leading-tight ${isLarge ? 'text-2xl' : 'text-lg'}`}>
          <Link
            href={`/blog/${post.slug}`}
            className="text-gray-900 dark:text-gray-100 hover:text-primary-500 transition-colors"
          >
            {post.title}
          </Link>
        </h3>
        <p className={`text-gray-600 dark:text-gray-400 mb-4 ${isLarge ? '' : 'text-sm line-clamp-2'}`}>
          {post.summary}
        </p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={post.date}>{formatDate(post.date, siteMetadata.locale)}</time>
          <span className="mx-2">•</span>
          <Link
            href={`/blog/${post.slug}`}
            className="text-primary-500 hover:text-primary-600 transition-colors"
          >
            Read more {isLarge ? '→' : ''}
          </Link>
        </div>
      </article>
    </div>
  )
}

export default FeaturedPostCard