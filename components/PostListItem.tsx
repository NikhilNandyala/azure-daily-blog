import Link from '@/components/Link'
import TagChip from '@/components/TagChip'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

interface PostListItemProps {
  post: {
    slug: string
    date: string
    title: string
    summary?: string
    tags: string[]
    featured?: boolean
    pinned?: boolean
    membersOnly?: boolean
  }
  isAuthenticated?: boolean
}

const PostListItem = ({ post, isAuthenticated = false }: PostListItemProps) => {
  const DEBUG_LAYOUT = false
  const targetHref =
    post.membersOnly && !isAuthenticated
      ? `/login?callbackUrl=${encodeURIComponent(`/blog/${post.slug}`)}`
      : `/blog/${post.slug}`
  return (
    <article
      className={`mb-8 min-w-0 overflow-hidden border-b border-white/6 pb-8 last:mb-0 last:border-b-0 last:pb-0 ${DEBUG_LAYOUT ? 'ring-2 ring-orange-500' : ''}`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {post.tags.map((tag) => (
          <TagChip key={tag} text={tag} />
        ))}
        {post.membersOnly && (
          <Link
            href={targetHref}
            className="text-body inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#1F2937] px-2 py-1 text-xs font-semibold"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              <path d="M6 10V8a6 6 0 1 1 12 0v2" />
              <rect x="4" y="10" width="16" height="10" rx="2" />
            </svg>
            Members
          </Link>
        )}
      </div>
      <h3 className="mb-3 line-clamp-2 text-xl leading-tight font-bold break-words">
        <Link href={targetHref} className="text-body hover:text-accent transition-colors">
          {post.title}
        </Link>
      </h3>
      <p className="text-muted mb-4 line-clamp-2 leading-relaxed">
        {post.summary || 'No summary available'}
      </p>
      <div className="text-muted flex items-center text-sm">
        <time dateTime={post.date}>{formatDate(post.date, siteMetadata.locale)}</time>
        <span className="mx-2">•</span>
        <Link href={targetHref} className="text-accent hover:text-primary-300 transition-colors">
          Read more →
        </Link>
      </div>
    </article>
  )
}

export default PostListItem
