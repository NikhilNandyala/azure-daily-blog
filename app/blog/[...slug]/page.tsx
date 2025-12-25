import 'css/prism.css'
import 'css/highlight.css'
import 'katex/dist/katex.css'

import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from '@/components/Link'
import SectionContainer from '@/components/SectionContainer'
import { getSiteSettings } from '@/lib/sanity/getSiteSettings'
import { getPostBySlug, getAllPostSlugs } from '@/lib/sanity/queriesDraft'
import { getSanityClient } from '@/lib/sanity/getClient'
import { SanityPortableText } from '@/components/SanityPortableText'
import { PostBody } from '@/components/PostBody'
import { SanityCoverImage } from '@/components/SanityImage'
import { buildPostMetadata, generateBlogPostSchema } from '@/lib/sanity/seo'
import { DraftModeBanner } from '@/components/DraftModeBanner'
import { sanityConfigured, getPublicClient } from '@/lib/sanity/client'

// Revalidate every 24 hours
export const revalidate = 86400

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }) {
  if (!sanityConfigured) return undefined

  const params = await props.params
  const slug = params.slug[0]
  const client = await getSanityClient()

  if (!client) return undefined

  const post = await getPostBySlug(client, slug)
  const settings = await getSiteSettings(client)

  if (!post) return undefined

  return buildPostMetadata(post, settings)
}

export async function generateStaticParams() {
  if (!sanityConfigured) return []

  const client = getPublicClient()
  if (!client) return []

  try {
    const slugs = await getAllPostSlugs(client)
    return slugs.map((item) => ({ slug: [item.current] }))
  } catch (error) {
    console.error('Error generating static params for blog posts:', error)
    return []
  }
}

export default async function PostPage(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = params.slug[0]
  const draft = await draftMode()
  const client = await getSanityClient()

  if (!client) {
    return (
      <SectionContainer>
        <div className="space-y-4 py-24 text-center">
          <h1 className="text-3xl font-bold">Sanity configuration missing</h1>
          <p className="text-muted">
            Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to build blog pages.
          </p>
        </div>
      </SectionContainer>
    )
  }

  const post = await getPostBySlug(client, slug)
  if (!post) notFound()
  if (post.status === 'draft' && !draft.isEnabled) notFound()

  const session = await getServerSession(authOptions)
  const isMembersOnly = post.membersOnly
  const settings = await getSiteSettings(client)

  if (isMembersOnly && !session) {
    const callbackUrl = `/blog/${slug}`
    const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md rounded-lg border border-white/6 bg-[#111827] p-8 text-center">
          <p className="text-accent mb-2 flex items-center justify-center gap-2 text-sm font-semibold tracking-wide uppercase">
            <svg
              className="h-4 w-4"
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
            Members Only
          </p>
          <h2 className="text-body mb-3 text-2xl font-bold">Sign in to continue</h2>
          <p className="text-muted mb-6">
            This post is reserved for members. Please sign in to unlock the content.
          </p>
          <div className="flex justify-center">
            <Link
              href={loginHref}
              className="text-inverse rounded-md bg-[#38BDF8] px-4 py-2 text-sm font-medium hover:bg-[#60A5FA]"
            >
              Log in to read
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const jsonLd = generateBlogPostSchema(post, settings)

  return (
    <>
      {draft.isEnabled && <DraftModeBanner />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SectionContainer>
        <div className={`xl:divide-y xl:divide-white/6 ${draft.isEnabled ? 'pt-24' : ''}`}>
          <div className="divide-y divide-white/6 pb-8 xl:col-span-3 xl:pb-0">
            <header className="py-6">
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
              <div className="space-y-1 text-center">
                {draft.isEnabled && post.status === 'draft' && (
                  <div className="mb-4 inline-block rounded-full border border-amber-500 bg-amber-500/20 px-3 py-1 text-sm font-semibold text-amber-600">
                    DRAFT
                  </div>
                )}
                <dl className="space-y-10">
                  <div>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-muted text-base leading-6 font-medium">
                      {post.publishedAt ? (
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      ) : (
                        'Date not set'
                      )}
                    </dd>
                  </div>
                </dl>
                <div>
                  <h1 className="text-body text-3xl leading-9 font-bold tracking-tight sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
                    {post.title}
                  </h1>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 pt-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag._id}
                        className="mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        #{tag.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {post.coverImage && (
              <div className="relative -mx-6 my-8 w-full md:mx-0">
                <SanityCoverImage image={post.coverImage} alt={post.title} priority />
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none py-6">
              {post.markdownBody ? (
                <PostBody content={post.markdownBody} />
              ) : (
                <SanityPortableText value={post.body} />
              )}
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  )
}
