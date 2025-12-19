import Link from '@/components/Link'
import TagChip from '@/components/TagChip'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

interface FeaturedPostCardProps {
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
  variant?: 'large' | 'small'
  isAuthenticated?: boolean
}

const FeaturedPostCard = ({
  post,
  variant = 'small',
  isAuthenticated = false,
}: FeaturedPostCardProps) => {
  const isLarge = variant === 'large'
  const targetHref =
    post.membersOnly && !isAuthenticated
      ? `/login?callbackUrl=${encodeURIComponent(`/blog/${post.slug}`)}`
      : `/blog/${post.slug}`

  const DEBUG_LAYOUT = false
  return (
    <div
      className={`min-w-0 overflow-hidden rounded-lg border border-white/6 bg-[#111827] p-6 ${isLarge ? '' : 'h-full'} ${DEBUG_LAYOUT ? 'ring-2 ring-pink-500' : ''}`}
    >
      <article>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {post.tags.slice(0, isLarge ? 3 : 2).map((tag) => (
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
        <h3
          className={`mb-3 leading-tight font-bold break-words ${isLarge ? 'line-clamp-3 text-2xl' : 'line-clamp-2 text-lg'}`}
        >
          <Link href={targetHref} className="text-body hover:text-accent transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className={`text-muted mb-4 line-clamp-2 ${isLarge ? '' : 'text-sm'}`}>
          {post.summary || 'No summary available'}
        </p>
        <div className="text-muted flex items-center text-sm">
          <time dateTime={post.date}>{formatDate(post.date, siteMetadata.locale)}</time>
          <span className="mx-2">•</span>
          <Link href={targetHref} className="text-accent hover:text-primary-300 transition-colors">
            Read more {isLarge ? '→' : ''}
          </Link>
        </div>
      </article>
    </div>
  )
}

export default FeaturedPostCard
