import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPostsByTag, getPostsByTagCount, getAllTags } from '@/lib/sanity/queries'
import SanityPostCard from '@/components/SanityPostCard'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Link from '@/components/Link'

const POSTS_PER_PAGE = 10

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tags = await getAllTags()
  return tags.map((tag) => ({
    tag: tag.slug.current,
  }))
}

// Revalidate every hour
export const revalidate = 3600

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tagSlug = decodeURI(params.tag)

  const session = await getServerSession(authOptions)
  const isAuthenticated = Boolean(session)

  // Fetch posts by tag from Sanity
  const posts = await getPostsByTag(tagSlug, POSTS_PER_PAGE, 0)
  const totalCount = await getPostsByTagCount(tagSlug)
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  // Find the tag info for display
  const allTags = await getAllTags()
  const currentTag = allTags.find((t) => t.slug.current === tagSlug)
  const title = currentTag?.title || tagSlug

  return (
    <SectionContainer>
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-blue-400 transition-colors hover:text-blue-300"
          aria-label="Back to home page"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <PageTitle>Tag: {title}</PageTitle>
        <p className="text-muted text-lg">
          {totalCount} {totalCount === 1 ? 'post' : 'posts'} tagged with &quot;{title}&quot;
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted">No posts found for this tag.</p>
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

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Link
                href={`/tags/${tagSlug}/page/2`}
                className="text-accent hover:text-primary-300 font-medium"
              >
                Next Page →
              </Link>
            </div>
          )}
        </>
      )}
    </SectionContainer>
  )
}
