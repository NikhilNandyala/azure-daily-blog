import Link from '@/components/Link'
import { SanityImage } from '@/components/SanityImage'
import type { PostListItem } from '@/lib/sanity/types'

interface SanityPostCardProps {
  post: PostListItem
  isAuthenticated?: boolean
}

const SanityPostCard = ({ post, isAuthenticated = false }: SanityPostCardProps) => {
  const targetHref =
    post.membersOnly && !isAuthenticated
      ? `/login?callbackUrl=${encodeURIComponent(`/blog/${post.slug.current}`)}`
      : `/blog/${post.slug.current}`

  const cardClass = [
    'post-card card-accent group relative min-w-0',
    post.featured ? 'post-card--featured' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={cardClass}>
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-40 w-full flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105 md:h-32 md:w-40">
            <SanityImage
              image={post.coverImage}
              alt={post.title}
              width={160}
              height={128}
              className="rounded-lg object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          {/* Tags and Badges */}
          {(post.tags && post.tags.length > 0) || post.membersOnly ? (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {post.tags?.map((tag) => {
                const isAzureTag = tag.title.toLowerCase().includes('azure')
                return (
                  <Link
                    key={tag._id}
                    href={`/tags/${tag.slug.current}`}
                    className={`tag-pill${isAzureTag ? ' tag-pill--azure' : ''}`}
                  >
                    {tag.title}
                  </Link>
                )
              })}
              {post.membersOnly && (
                <Link
                  href={targetHref}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(0,120,212,0.08), rgba(0,188,242,0.04))',
                    border: '1px solid rgba(0,120,212,0.3)',
                    color: 'var(--azure-light)',
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
              className={`transition-colors hover:text-[var(--azure-light)] ${
                post.featured ? 'gradient-text' : 'text-body'
              }`}
            >
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mb-4 line-clamp-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center text-sm" style={{ color: 'var(--muted)' }}>
            {post.publishedAt && (
              <>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
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
              style={{ color: 'var(--azure-light)' }}
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
