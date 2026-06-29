import 'css/prism.css'
import 'css/highlight.css'

import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from '@/components/Link'
import SectionContainer from '@/components/SectionContainer'
import { getAllPosts, getPostBySlug } from '@/lib/content'
import { MDXRenderer } from '@/components/MDXRenderer'
import { ViewTracker } from '@/components/ViewTracker'
import { ScrollProgressBar } from '@/components/ScrollProgressBar'
import { ReadingTimeBadge } from '@/components/ReadingTimeBadge'
import { BackToTop } from '@/components/BackToTop'
import { TableOfContents } from '@/components/TableOfContents'
import { slug as slugify } from 'github-slugger'
import type { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

export const revalidate = 86400

export async function generateMetadata(
  props: { params: Promise<{ slug: string[] }> }
): Promise<Metadata> {
  const params = await props.params
  const postSlug = params.slug[0]
  const post = getPostBySlug(postSlug)
  if (!post) return { title: 'Post not found' }

  return {
    title: `${post.title} | ${siteMetadata.title}`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: [post.slug] }))
}

export default async function PostPage(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const postSlug = params.slug[0]

  const post = getPostBySlug(postSlug)
  if (!post) notFound()

  // TEMPORARILY DISABLED — membersOnly gating removed so all posts are public.
  // Re-enable when membership launches: uncomment the block below.
  // const session = await getServerSession(authOptions)
  // if (post.membersOnly && !session) {
  //   const callbackUrl = `/blog/${postSlug}`
  //   const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="max-w-md rounded-lg border border-white/6 bg-[#111827] p-8 text-center">
  //         <p className="text-accent mb-2 flex items-center justify-center gap-2 text-sm font-semibold tracking-wide uppercase">
  //           <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //             <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
  //             <path d="M6 10V8a6 6 0 1 1 12 0v2" />
  //             <rect x="4" y="10" width="16" height="10" rx="2" />
  //           </svg>
  //           Members Only
  //         </p>
  //         <h2 className="text-body mb-3 text-2xl font-bold">Sign in to continue</h2>
  //         <p className="text-muted mb-6">
  //           This post is reserved for members. Please sign in to unlock the content.
  //         </p>
  //         <div className="flex justify-center">
  //           <Link href={loginHref} className="text-inverse rounded-md bg-[#38BDF8] px-4 py-2 text-sm font-medium hover:bg-[#60A5FA]">
  //             Log in to read
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  const minutes = Math.ceil((post.readingTime as { minutes: number }).minutes) || 1

  return (
    <>
      <ScrollProgressBar />
      <ViewTracker slug={postSlug} />
      <SectionContainer>
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            background: 'rgba(5, 13, 26, 0.55)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            borderRadius: '16px',
            padding: '40px 48px',
            border: '0.5px solid rgba(200,134,10,0.1)',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          {/* Post header */}
          <header className="border-b border-white/6 py-6">
            <div className="mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm transition-colors hover:text-[#ffd166]"
                style={{ color: '#8a7a5a' }}
                aria-label="Back to blog"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to blog
              </Link>
            </div>
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-muted flex items-center justify-center gap-3 font-medium" style={{ fontSize: '14px' }}>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span aria-hidden="true">·</span>
                    <ReadingTimeBadge minutes={minutes} />
                  </dd>
                </div>
              </dl>
              <div>
                <h1 className="text-body tracking-tight" style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.2 }}>
                  {post.title}
                </h1>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${slugify(tag)}`}
                      className="mr-2 inline-block rounded-full font-semibold"
                      style={{ background: 'rgba(200,134,10,0.10)', border: '1px solid rgba(200,134,10,0.35)', color: '#d4a843', fontSize: '13px', padding: '5px 14px' }}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Content + ToC sidebar */}
          <div className="xl:grid xl:grid-cols-[1fr_240px] xl:gap-10">
            <div className="prose dark:prose-invert max-w-none py-6">
              <MDXRenderer code={post.body.code} />
            </div>

            {/* Sticky ToC — desktop only */}
            <aside className="hidden xl:block py-6">
              <TableOfContents />
            </aside>
          </div>
        </div>
      </SectionContainer>

      <BackToTop />
    </>
  )
}
