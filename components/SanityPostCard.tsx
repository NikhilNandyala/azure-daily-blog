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

  return (
    <article className="group relative mb-8 min-w-0 overflow-hidden border-b border-white/6 pb-8 last:mb-0 last:border-b-0 last:pb-0">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Cover Image - Optional */}
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
              {post.tags?.map((tag) => (
                <Link
                  key={tag._id}
                  href={`/tags/${tag.slug.current}`}
                  className="text-body hover:text-inverse mr-2 inline-block rounded-full bg-[#1F2937] px-3 py-1 text-xs transition-colors hover:bg-[#38BDF8]"
                >
                  {tag.title}
                </Link>
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
          ) : null}

          {/* Title */}
          <h3 className="mb-3 line-clamp-2 text-xl leading-tight font-bold break-words">
            <Link href={targetHref} className="text-body hover:text-accent transition-colors">
              {post.title}
            </Link>
          </h3>

          {/* Excerpt - Optional */}
          {post.excerpt && (
            <p className="text-muted mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
          )}

          {/* Meta */}
          <div className="text-muted flex items-center text-sm">
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
              className="text-accent hover:text-primary-300 transition-colors"
            >
              Read more →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default SanityPostCard
