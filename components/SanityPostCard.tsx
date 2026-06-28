import Link from '@/components/Link'
import type { Blog } from 'contentlayer/generated'
import { slug as slugify } from 'github-slugger'

interface SanityPostCardProps {
  post: Blog
  isAuthenticated?: boolean
}

const SanityPostCard = ({ post, isAuthenticated = false }: SanityPostCardProps) => {
  const targetHref =
    post.membersOnly && !isAuthenticated
      ? `/login?callbackUrl=${encodeURIComponent(`/blog/${post.slug}`)}`
      : `/blog/${post.slug}`

  const cardClass = [
    'post-card card-accent group relative min-w-0',
    post.featured ? 'post-card--featured' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={cardClass}>
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          {/* Tags and Badges */}
          {(post.tags && post.tags.length > 0) || post.membersOnly ? (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {post.tags?.map((tag) => {
                const isAzureTag = tag.toLowerCase().includes('azure')
                return (
                  <Link
                    key={tag}
                    href={`/tags/${slugify(tag)}`}
                    className={`tag-pill${isAzureTag ? ' tag-pill--azure' : ''}`}
                  >
                    {tag}
                  </Link>
                )
              })}
              {post.membersOnly && (
                <Link
                  href={targetHref}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
                  style={{
                    background: 'rgba(200,134,10,0.10)',
                    border: '1px solid rgba(200,134,10,0.35)',
                    color: '#d4a843',
                  }}
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
          ) : null}

          {/* Title */}
          <h3 className="mb-3 line-clamp-2 text-xl leading-tight font-bold break-words">
            <Link
              href={targetHref}
              className={`transition-colors hover:text-[var(--link)] ${
                post.featured ? 'gradient-text' : 'text-body'
              }`}
            >
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          {post.summary && (
            <p className="mb-4 line-clamp-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
              {post.summary}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center text-sm" style={{ color: 'var(--muted)' }}>
            {post.date && (
              <>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span className="mx-2">•</span>
              </>
            )}
            <Link
              href={targetHref}
              className="group/rm inline-flex items-center gap-1 transition-colors"
              style={{ color: 'var(--link)' }}
            >
              Read more{' '}
              <span className="inline-block transition-transform group-hover/rm:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default SanityPostCard
