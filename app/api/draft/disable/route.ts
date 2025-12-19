import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Disable draft mode
 * GET /api/draft/disable
 *
 * Disables draft mode and redirects to blog listing
 */
export async function GET(request: Request) {
  const draft = await draftMode()
  draft.disable()

  // Redirect to blog page
  redirect('/blog')
}

/**
 * POST version for compatibility
 */
export async function POST(request: Request) {
  const draft = await draftMode()
  draft.disable()

  return new Response(JSON.stringify({ message: 'Draft mode disabled' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
