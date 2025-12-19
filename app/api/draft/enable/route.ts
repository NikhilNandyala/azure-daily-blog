import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Enable draft mode for preview
 * POST /api/draft/enable?secret=<token>&slug=<post-slug>
 *
 * Usage:
 * - Call from Sanity Studio with preview webhook
 * - Or manually via: /api/draft/enable?secret=<token>&slug=<slug>
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // Verify secret token matches environment variable
  const draftToken = process.env.SANITY_DRAFT_SECRET_TOKEN

  if (!draftToken || secret !== draftToken) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!slug) {
    return new Response('Missing slug parameter', { status: 400 })
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Redirect to the post preview page
  redirect(`/blog/${slug}`)
}

/**
 * POST version for webhook compatibility
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // Verify secret token
  const draftToken = process.env.SANITY_DRAFT_SECRET_TOKEN

  if (!draftToken || secret !== draftToken) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!slug) {
    return new Response('Missing slug parameter', { status: 400 })
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Return JSON response for webhook
  return new Response(JSON.stringify({ message: 'Draft mode enabled', slug }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
