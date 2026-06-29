import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { genPageMetadata } from 'app/seo'
import { getPaginatedPosts } from '@/lib/content'
import { slug as slugify } from 'github-slugger'
import Link from '@/components/Link'
import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'

const postTypeConfig: Record<string, { emoji: string; label: string; color: string; border: string; text: string }> = {
  troubleshooting: { emoji: '🔧', label: 'Troubleshooting', color: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
  tutorial:        { emoji: '📖', label: 'Tutorial',        color: 'rgba(0,120,212,0.15)', border: 'rgba(0,120,212,0.3)', text: '#2899f5' },
  architecture:    { emoji: '🏗',  label: 'Architecture',   color: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)', text: '#a78bfa' },
  devops:          { emoji: '⚙️', label: 'DevOps',          color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24' },
  news:            { emoji: '📢', label: 'News',             color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
  ai:              { emoji: '🤖', label: 'AI / GenAI',      color: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.3)', text: '#f472b6' },
}

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

export const revalidate = 86400

export default async function BlogPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams
  const pageNumber = parseInt(searchParams.page || '1', 10)

  const { posts, totalPages } = getPaginatedPosts(pageNumber, POSTS_PER_PAGE)

  // TEMPORARILY DISABLED — all posts public, no auth gate
  // const session = await getServerSession(authOptions)
  const session = null // remove when re-enabling membership

  return (
    <SectionContainer>
      <nav aria-label="Breadcrumb" className="mb-4 pt-4">
        <ol className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
          <li>
            <Link href="/" style={{ color: 'var(--muted)' }} className="transition-colors hover:text-white">
              Home
            </Link>
          </li>
          <li aria-hidden="true" style={{ color: 'var(--border-bright)' }}>/</li>
          <li style={{ color: 'var(--text)' }} aria-current="page">Blog</li>
        </ol>
      </nav>
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <PageTitle>Blog</PageTitle>
        <p className="text-muted text-lg leading-7">
          Thoughts on Azure, networking, and cloud infrastructure
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted">No posts available yet.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:gap-8">
            {posts.map((post) => {
              const isMembersOnly = post.membersOnly
              // TEMPORARILY DISABLED — always use direct href
              // const isAuthenticated = Boolean(session)
              const isAuthenticated = true
              const href = `/blog/${post.slug}`
              // const href = isMembersOnly && !isAuthenticated
              //   ? `/login?callbackUrl=${encodeURIComponent(`/blog/${post.slug}`)}`
              //   : `/blog/${post.slug}`

              return (
                <article
                  key={post.slug}
                  className="post-card group"
                >
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <time className="text-muted text-sm">
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                          {post.postType && postTypeConfig[post.postType] && (
                            <span
                              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
                              style={{
                                background: postTypeConfig[post.postType].color,
                                border: `1px solid ${postTypeConfig[post.postType].border}`,
                                color: postTypeConfig[post.postType].text,
                              }}
                            >
                              {postTypeConfig[post.postType].emoji} {postTypeConfig[post.postType].label}
                            </span>
                          )}
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Link
                                key={tag}
                                href={`/tags/${slugify(tag)}`}
                                className="text-accent inline-block rounded bg-white/5 px-2 py-1 text-xs transition-colors hover:bg-white/10"
                              >
                                #{tag}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <h2 className="text-body group-hover:text-accent mb-2 text-xl font-bold transition-colors md:text-2xl">
                          {post.title}
                        </h2>
                        <p className="text-muted line-clamp-2">{post.summary}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/6 pt-4">
                        <span className="text-muted text-sm">{post.authors?.[0] ?? 'NVN'}</span>
                        <Link href={href} className="text-accent hover:text-primary-300 font-medium transition-colors">
                          Read more →
                        </Link>
                      </div>
                    </div>
                  </div>

                  {post.featured && (
                    <div className="bg-accent/20 border-accent text-accent absolute top-4 right-4 rounded-full border px-3 py-1 text-xs font-semibold">
                      Featured
                    </div>
                  )}
                  {/* TEMPORARILY DISABLED — members-only overlay removed
                  {isMembersOnly && !isAuthenticated && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                      <span className="font-semibold text-white">Members Only</span>
                    </div>
                  )} */}
                </article>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-white/6 pt-8">
              {pageNumber > 1 ? (
                <Link href={`/blog?page=${pageNumber - 1}`} className="text-accent hover:text-primary-300 font-medium">
                  ← Previous
                </Link>
              ) : (
                <div />
              )}
              <span className="text-muted">Page {pageNumber} of {totalPages}</span>
              {pageNumber < totalPages ? (
                <Link href={`/blog?page=${pageNumber + 1}`} className="text-accent hover:text-primary-300 font-medium">
                  Next →
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}
        </>
      )}
    </SectionContainer>
  )
}
