import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { genPageMetadata } from 'app/seo'
import { getAllPublishedPosts, getPublishedPostsCount } from '@/lib/sanity/queries'
import { PostListItem } from '@/lib/sanity/types'
import Link from '@/components/Link'
import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import { SanityImage, SanityAvatar } from '@/components/SanityImage'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

// Revalidate every 24 hours
export const revalidate = 86400

export default async function BlogPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams
  const pageNumber = parseInt(searchParams.page || '1', 10)
  const offset = (pageNumber - 1) * POSTS_PER_PAGE

  // Fetch posts from Sanity
  const sanityPosts = await getAllPublishedPosts(POSTS_PER_PAGE, offset)
  const totalPostsCount = await getPublishedPostsCount()
  const totalPages = Math.ceil(totalPostsCount / POSTS_PER_PAGE)

  const session = await getServerSession(authOptions)

  return (
    <SectionContainer>
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <PageTitle>Blog</PageTitle>
        <p className="text-muted text-lg leading-7">
          Thoughts on Azure, networking, and cloud infrastructure
        </p>
      </div>

      {sanityPosts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted">No posts available yet.</p>
        </div>
      ) : (
        <>
          {/* Posts Grid */}
          <div className="grid gap-6 md:gap-8">
            {sanityPosts.map((post: PostListItem) => (
              <article
                key={post._id}
                className="group relative overflow-hidden rounded-lg border border-white/6 bg-gradient-to-b from-white/5 to-white/0 p-6 transition-all duration-300 hover:border-white/20"
              >
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Cover Image */}
                  {post.coverImage && (
                    <div className="relative h-40 w-full flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105 md:w-40">
                      <SanityImage
                        image={post.coverImage}
                        alt={post.title}
                        width={160}
                        height={160}
                        className="rounded-lg"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between">
                    {/* Date and Tags */}
                    <div className="mb-3">
                      {post.publishedAt && (
                        <time className="text-muted text-sm">
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag._id}
                              className="text-accent inline-block rounded bg-white/5 px-2 py-1 text-xs transition-colors hover:bg-white/10"
                            >
                              #{tag.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Title and Excerpt */}
                    <div className="mb-4">
                      <h2 className="text-body group-hover:text-accent mb-2 text-xl font-bold transition-colors md:text-2xl">
                        {post.title}
                      </h2>
                      <p className="text-muted line-clamp-2">{post.excerpt}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-white/6 pt-4">
                      <div className="flex items-center gap-2">
                        {post.author?.image && (
                          <SanityAvatar
                            image={post.author.image}
                            alt={post.author.name}
                            size={32}
                          />
                        )}
                        <span className="text-muted text-sm">{post.author?.name}</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug.current}`}
                        className="text-accent hover:text-primary-300 font-medium transition-colors"
                      >
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
                {post.membersOnly && !session && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                    <span className="font-semibold text-white">Members Only</span>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-white/6 pt-8">
              {pageNumber > 1 ? (
                <Link
                  href={`/blog?page=${pageNumber - 1}`}
                  className="text-accent hover:text-primary-300 font-medium"
                >
                  ← Previous
                </Link>
              ) : (
                <div />
              )}

              <span className="text-muted">
                Page {pageNumber} of {totalPages}
              </span>

              {pageNumber < totalPages ? (
                <Link
                  href={`/blog?page=${pageNumber + 1}`}
                  className="text-accent hover:text-primary-300 font-medium"
                >
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
