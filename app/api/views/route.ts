import { NextRequest, NextResponse } from 'next/server'
import { getPublicClient } from '@/lib/sanity/client'

/**
 * POST /api/views
 * Increments the view count for a specific blog post
 *
 * Body: { slug: string }
 * Returns: { views: number } | { error: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json()

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Invalid slug provided' }, { status: 400 })
    }

    const client = getPublicClient()
    if (!client) {
      return NextResponse.json({ error: 'Sanity client not configured' }, { status: 500 })
    }

    // First, get the current post to retrieve its ID and current views
    const post = await client.fetch<{ _id: string; views: number } | null>(
      `*[_type == "post" && slug.current == $slug][0] { _id, views }`,
      { slug }
    )

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Increment views using Sanity's patch API
    const currentViews = post.views || 0
    const newViews = currentViews + 1

    await client.patch(post._id).set({ views: newViews }).commit({ autoGenerateArrayKeys: true })

    return NextResponse.json({ views: newViews }, { status: 200 })
  } catch (error) {
    console.error('Error incrementing post views:', error)
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 })
  }
}

/**
 * GET /api/views?slug=post-slug
 * Retrieves the view count for a specific blog post
 *
 * Query: slug (string)
 * Returns: { views: number } | { error: string }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter required' }, { status: 400 })
    }

    const client = getPublicClient()
    if (!client) {
      return NextResponse.json({ error: 'Sanity client not configured' }, { status: 500 })
    }

    const post = await client.fetch<{ views: number } | null>(
      `*[_type == "post" && slug.current == $slug][0] { views }`,
      { slug }
    )

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ views: post.views || 0 }, { status: 200 })
  } catch (error) {
    console.error('Error fetching post views:', error)
    return NextResponse.json({ error: 'Failed to fetch views' }, { status: 500 })
  }
}
