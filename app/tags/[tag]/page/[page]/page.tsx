import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getPostsByTag,
  getPostsByTagCount,
  getAllTags,
  getTagsWithCounts,
} from '@/lib/sanity/queries'
import SanityPostCard from '@/components/SanityPostCard'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Link from '@/components/Link'

const POSTS_PER_PAGE = 10

export const generateStaticParams = async () => {
  const tagsWithCounts = await getTagsWithCounts()
  return tagsWithCounts.flatMap(({ tag, count }) => {
    const totalPages = Math.max(1, Math.ceil(count / POSTS_PER_PAGE))
    return Array.from({ length: totalPages }, (_, i) => ({
      tag: tag.slug.current,
      page: (i + 1).toString(),
    }))
  })
}

// Revalidate every hour
export const revalidate = 3600

export default async function TagPagePaginated(props: {
  params: Promise<{ tag: string; page: string }>
}) {
  const params = await props.params
  const tagSlug = decodeURI(params.tag)
  const pageNumber = parseInt(params.page)

  if (isNaN(pageNumber) || pageNumber <= 0) {
    return notFound()
  }

  const session = await getServerSession(authOptions)
  const isAuthenticated = Boolean(session)

  // Fetch posts by tag from Sanity
  const offset = (pageNumber - 1) * POSTS_PER_PAGE
  const posts = await getPostsByTag(tagSlug, POSTS_PER_PAGE, offset)
  const totalCount = await getPostsByTagCount(tagSlug)
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  // Return 404 for invalid page numbers
  if (pageNumber > totalPages) {
    return notFound()
  }

  // Find the tag info for display
  const allTags = await getAllTags()
  const currentTag = allTags.find((t) => t.slug.current === tagSlug)
  const title = currentTag?.title || tagSlug

  return (
    <SectionContainer>
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <PageTitle>
          Tag: {title} (Page {pageNumber})
        </PageTitle>
        <p className="text-muted text-lg">
          {totalCount} {totalCount === 1 ? 'post' : 'posts'} tagged with &quot;{title}&quot;
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted">No posts found for this page.</p>
          <Link href="/tags" className="text-accent hover:text-primary-300 mt-4 inline-block">
            ← View all tags
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {posts.map((post) => (
              <SanityPostCard key={post._id} post={post} isAuthenticated={isAuthenticated} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-between">
            {pageNumber > 1 ? (
              <Link
                href={
                  pageNumber - 1 === 1
                    ? `/tags/${tagSlug}`
                    : `/tags/${tagSlug}/page/${pageNumber - 1}`
                }
                className="text-accent hover:text-primary-300 font-medium"
              >
                ← Previous Page
              </Link>
            ) : (
              <div />
            )}

            <span className="text-muted">
              Page {pageNumber} of {totalPages}
            </span>

            {pageNumber < totalPages ? (
              <Link
                href={`/tags/${tagSlug}/page/${pageNumber + 1}`}
                className="text-accent hover:text-primary-300 font-medium"
              >
                Next Page →
              </Link>
            ) : (
              <div />
            )}
          </div>
        </>
      )}
    </SectionContainer>
  )
}
