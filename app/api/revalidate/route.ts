import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Sanity Webhook Handler for On-Demand Revalidation
 *
 * Setup in Sanity:
 * 1. Go to your Sanity project → API → Webhooks
 * 2. Create a new webhook with URL: https://your-site.com/api/revalidate
 * 3. Set a secret token (add to SANITY_REVALIDATE_SECRET env var)
 * 4. Configure to trigger on:
 *    - Document type: post
 *    - Actions: create, update, delete
 *    - Document type: tag
 *    - Actions: create, update, delete
 */

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook secret
    const secret = request.nextUrl.searchParams.get('secret')
    const expectedSecret = process.env.SANITY_REVALIDATE_SECRET

    if (!expectedSecret) {
      console.warn('SANITY_REVALIDATE_SECRET not configured')
      return NextResponse.json({ message: 'Revalidation secret not configured' }, { status: 500 })
    }

    if (secret !== expectedSecret) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Parse the webhook payload
    const body = await request.json()
    const { _type, slug } = body

    console.log('Revalidation triggered for:', { _type, slug })

    // Revalidate based on document type
    if (_type === 'post') {
      // Revalidate homepage
      revalidatePath('/')

      // Revalidate blog list pages
      revalidatePath('/blog')

      // Revalidate specific post if slug exists
      if (slug?.current) {
        revalidatePath(`/blog/${slug.current}`)
      }

      // Revalidate all tag pages (since post tags may have changed)
      revalidateTag('tags')
    } else if (_type === 'tag') {
      // Revalidate homepage (for popular tags sidebar)
      revalidatePath('/')

      // Revalidate tags index page
      revalidatePath('/tags')

      // Revalidate specific tag page if slug exists
      if (slug?.current) {
        revalidatePath(`/tags/${slug.current}`)
      }
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: _type,
      slug: slug?.current,
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    )
  }
}

// Also support GET for testing
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET

  if (!expectedSecret) {
    return NextResponse.json({ message: 'Revalidation secret not configured' }, { status: 500 })
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  // Manual revalidation of all pages
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/tags')

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    message: 'Manual revalidation completed',
  })
}
