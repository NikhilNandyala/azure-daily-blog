import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPostsByTag, getAllTags } from '@/lib/content'
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
  const tags = getAllTags()
  return tags.map(({ slug }) => ({ tag: slug }))
}

export const revalidate = 3600

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tagSlug = decodeURI(params.tag)

  const session = await getServerSession(authOptions)
  const isAuthenticated = Boolean(session)

  const posts = getPostsByTag(tagSlug)
  const totalCount = posts.length
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)
  const displayPosts = posts.slice(0, POSTS_PER_PAGE)

  const allTags = getAllTags()
  const currentTag = allTags.find((t) => t.slug === tagSlug)
  const title = currentTag?.name || tagSlug

  return (
    <SectionContainer>
      <nav aria-label="Breadcrumb" className="mb-4 pt-4">
        <ol className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
          <li>
            <Link href="/" style={{ color: 'var(--muted)' }} className="transition-colors hover:text-white">Home</Link>
          </li>
          <li aria-hidden="true" style={{ color: 'var(--border-bright)' }}>/</li>
          <li>
            <Link href="/tags" style={{ color: 'var(--muted)' }} className="transition-colors hover:text-white">Tags</Link>
          </li>
          <li aria-hidden="true" style={{ color: 'var(--border-bright)' }}>/</li>
          <li style={{ color: 'var(--text)' }} aria-current="page">{title}</li>
        </ol>
      </nav>
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <PageTitle>Tag: {title}</PageTitle>
        <p className="text-muted text-lg">
          {totalCount} {totalCount === 1 ? 'post' : 'posts'} tagged with &quot;{title}&quot;
        </p>
      </div>

      {displayPosts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted">No posts found for this tag.</p>
          <Link href="/tags" className="text-accent hover:text-primary-300 mt-4 inline-block">
            ← View all tags
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {displayPosts.map((post) => (
              <SanityPostCard key={post.slug} post={post} isAuthenticated={isAuthenticated} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Link href={`/tags/${tagSlug}/page/2`} className="text-accent hover:text-primary-300 font-medium">
                Next Page →
              </Link>
            </div>
          )}
        </>
      )}
    </SectionContainer>
  )
}
