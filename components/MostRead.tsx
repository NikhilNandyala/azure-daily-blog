import Link from '@/components/Link'
import SidebarCard from '@/components/SidebarCard'

interface MostReadProps {
  posts: Array<{
    slug: string
    date: string
    title: string
    summary?: string
    tags: string[]
    featured?: boolean
    pinned?: boolean
    membersOnly?: boolean
  }>
  isAuthenticated?: boolean
}

export default function MostRead({ posts, isAuthenticated = false }: MostReadProps) {
  // Use pinned posts first, then fill with newest posts
  const pinnedPosts = posts.filter((post) => post.pinned === true)
  const remainingPosts = posts.filter((post) => post.pinned !== true)
  const mostReadPosts = [...pinnedPosts, ...remainingPosts].slice(0, 4)

  return (
    <SidebarCard title="Most Read">
      <ul className="w-full space-y-3">
        {mostReadPosts.map((post, index) => (
          <li key={post.slug} className="flex w-full min-w-0 items-start overflow-hidden">
            <span className="text-primary-500 mr-3 flex-shrink-0 text-sm font-bold">
              {index + 1}
            </span>
            <Link
              href={
                post.membersOnly && !isAuthenticated
                  ? `/login?callbackUrl=${encodeURIComponent(`/blog/${post.slug}`)}`
                  : `/blog/${post.slug}`
              }
              className="text-body hover:text-accent line-clamp-2 flex-1 text-sm leading-tight break-words"
            >
              {post.title}
            </Link>
            {post.membersOnly && (
              <span className="text-body ml-2 inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-white/10 bg-[#1F2937] px-2 py-1 text-[10px] font-semibold">
                <svg
                  className="h-3 w-3"
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
              </span>
            )}
          </li>
        ))}
      </ul>
    </SidebarCard>
  )
}
